package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.BillSplitDTO;
import com.clubsphere.cafe.dto.CafeteriaPaymentDTO;
import com.clubsphere.cafe.dto.SplitBillRequestDTO;
import com.clubsphere.cafe.entity.BillSplit;
import com.clubsphere.cafe.entity.CafeteriaOrder;
import com.clubsphere.cafe.entity.CafeteriaPayment;
import com.clubsphere.cafe.repository.BillSplitRepository;
import com.clubsphere.cafe.repository.CafeteriaOrderRepository;
import com.clubsphere.cafe.repository.CafeteriaPaymentRepository;
import com.clubsphere.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CafePaymentService {

    private final CafeteriaPaymentRepository paymentRepository;
    private final CafeteriaOrderRepository orderRepository;
    private final BillSplitRepository billSplitRepository;

    @Transactional
    public CafeteriaPaymentDTO processPayment(CafeteriaPaymentDTO dto) {
        CafeteriaOrder order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + dto.getOrderId()));

        CafeteriaPayment payment = CafeteriaPayment.builder()
                .orderId(dto.getOrderId())
                .amountPaid(dto.getAmountPaid())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus("COMPLETED")
                .transactionReference(dto.getTransactionReference())
                .paidAt(LocalDateTime.now())
                .build();

        CafeteriaPayment saved = paymentRepository.save(payment);
        log.info("Payment processed for order {}. Amount: {}", dto.getOrderId(), dto.getAmountPaid());

        return CafeteriaPaymentDTO.builder()
                .id(saved.getId())
                .orderId(saved.getOrderId())
                .amountPaid(saved.getAmountPaid())
                .paymentMethod(saved.getPaymentMethod())
                .paymentStatus(saved.getPaymentStatus())
                .transactionReference(saved.getTransactionReference())
                .build();
    }

    @Transactional
    public List<BillSplitDTO> splitBill(Long orderId, SplitBillRequestDTO dto) {
        CafeteriaOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        // Validate split amounts sum to order total
        BigDecimal splitTotal = dto.getSplits().stream()
                .map(BillSplitDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (splitTotal.compareTo(order.getTotalAmount()) != 0) {
            throw new IllegalArgumentException(
                    String.format("Split total (%.2f) does not match order total (%.2f)",
                            splitTotal, order.getTotalAmount()));
        }

        // Delete existing splits
        billSplitRepository.deleteAll(billSplitRepository.findByOrderId(orderId));

        AtomicInteger index = new AtomicInteger(1);
        List<BillSplit> splits = dto.getSplits().stream().map(splitDto -> {
            return BillSplit.builder()
                    .orderId(orderId)
                    .splitIndex(index.getAndIncrement())
                    .payerName(splitDto.getPayerName())
                    .amount(splitDto.getAmount())
                    .paymentMethod(splitDto.getPaymentMethod())
                    .paymentStatus("PENDING")
                    .build();
        }).collect(Collectors.toList());

        List<BillSplit> savedSplits = billSplitRepository.saveAll(splits);
        log.info("Bill split into {} parts for order {}", savedSplits.size(), orderId);

        return savedSplits.stream().map(s -> BillSplitDTO.builder()
                .payerName(s.getPayerName())
                .amount(s.getAmount())
                .paymentMethod(s.getPaymentMethod())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CafeteriaPaymentDTO> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(p -> CafeteriaPaymentDTO.builder()
                        .id(p.getId())
                        .orderId(p.getOrderId())
                        .amountPaid(p.getAmountPaid())
                        .paymentMethod(p.getPaymentMethod())
                        .paymentStatus(p.getPaymentStatus())
                        .transactionReference(p.getTransactionReference())
                        .build())
                .collect(Collectors.toList());
    }
}
