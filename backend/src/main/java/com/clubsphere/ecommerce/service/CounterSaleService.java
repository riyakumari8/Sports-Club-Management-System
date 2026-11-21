package com.clubsphere.ecommerce.service;

import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.ecommerce.dto.*;
import com.clubsphere.ecommerce.entity.CounterSale;
import com.clubsphere.ecommerce.entity.CounterSaleItem;
import com.clubsphere.ecommerce.repository.CounterSaleRepository;
import com.clubsphere.inventory.service.InventoryService;
import com.clubsphere.shop.entity.Product;
import com.clubsphere.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounterSaleService {

    private final CounterSaleRepository counterSaleRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    @Transactional
    public CounterSaleResponseDTO createCounterSale(CounterSaleDTO dto) {
        log.info("Processing counter sale");

        String receiptNumber = "RCP-" + System.currentTimeMillis() + "-" +
                String.format("%04d", ThreadLocalRandom.current().nextInt(10000));

        CounterSale sale = CounterSale.builder()
                .receiptNumber(receiptNumber)
                .staffId(dto.getStaffId())
                .customerName(dto.getCustomerName())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus("COMPLETED")
                .saleTime(LocalDateTime.now())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CounterSaleItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.getProductId()));

            if (!product.getIsActive()) {
                throw new IllegalArgumentException("Product is not active: " + product.getName());
            }

            // Check stock
            if (!inventoryService.isStockAvailable(itemDto.getProductId(), itemDto.getQuantity())) {
                throw new IllegalArgumentException("Insufficient stock for: " + product.getName());
            }

            BigDecimal unitPrice = product.getSellingPrice();
            BigDecimal discountAmt = product.getOriginalPrice().subtract(product.getSellingPrice())
                    .multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            CounterSaleItem saleItem = CounterSaleItem.builder()
                    .counterSale(sale)
                    .productId(product.getId())
                    .quantity(itemDto.getQuantity())
                    .unitPrice(unitPrice)
                    .discountAmount(discountAmt)
                    .lineTotal(lineTotal)
                    .build();
            sale.addItem(saleItem);
            totalAmount = totalAmount.add(lineTotal);
        }

        sale.setTotalAmount(totalAmount);
        CounterSale savedSale = counterSaleRepository.save(sale);

        // Deduct stock (uses pessimistic locking)
        for (CounterSaleItemDTO itemDto : dto.getItems()) {
            inventoryService.deductStock(itemDto.getProductId(), itemDto.getQuantity());
        }

        log.info("Counter sale {} completed. Total: {}", receiptNumber, totalAmount);
        return mapToResponseDTO(savedSale);
    }

    @Transactional(readOnly = true)
    public CounterSaleResponseDTO getCounterSaleById(Long id) {
        CounterSale sale = counterSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter sale not found: " + id));
        return mapToResponseDTO(sale);
    }

    @Transactional(readOnly = true)
    public List<CounterSaleResponseDTO> getAllCounterSales() {
        return counterSaleRepository.findAllByOrderBySaleTimeDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private CounterSaleResponseDTO mapToResponseDTO(CounterSale sale) {
        List<CounterSaleItemDTO> itemDTOs = sale.getItems().stream().map(item -> {
            return CounterSaleItemDTO.builder()
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .build();
        }).collect(Collectors.toList());

        return CounterSaleResponseDTO.builder()
                .id(sale.getId())
                .receiptNumber(sale.getReceiptNumber())
                .customerName(sale.getCustomerName())
                .items(itemDTOs)
                .totalAmount(sale.getTotalAmount())
                .paymentMethod(sale.getPaymentMethod())
                .paymentStatus(sale.getPaymentStatus())
                .saleTime(sale.getSaleTime())
                .build();
    }
}
