package com.clubsphere.ecommerce.service;

import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.ecommerce.dto.*;
import com.clubsphere.ecommerce.entity.*;
import com.clubsphere.ecommerce.repository.*;
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
public class ShopOrderService {

    private final ShopOrderRepository shopOrderRepository;
    private final ShopOrderItemRepository shopOrderItemRepository;
    private final ShopOrderStatusHistoryRepository statusHistoryRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;
    private final CartService cartService;

    @Transactional
    public ShopOrderDTO checkout(Long customerId, CheckoutDTO dto) {
        log.info("Processing checkout for customer {}", customerId);

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for customer: " + customerId));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty. Add items before checkout.");
        }

        // Validate all items have sufficient stock
        for (CartItem cartItem : cart.getItems()) {
            if (!inventoryService.isStockAvailable(cartItem.getProductId(), cartItem.getQuantity())) {
                Product p = productRepository.findById(cartItem.getProductId()).orElse(null);
                String name = p != null ? p.getName() : "ID:" + cartItem.getProductId();
                throw new IllegalArgumentException("Insufficient stock for: " + name);
            }
        }

        // Generate order number
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" +
                String.format("%04d", ThreadLocalRandom.current().nextInt(10000));

        // Create order
        ShopOrder order = ShopOrder.builder()
                .orderNumber(orderNumber)
                .customerId(customerId)
                .orderType(dto.getOrderType())
                .deliveryAddress(dto.getDeliveryAddress())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus("PENDING")
                .orderStatus("PENDING")
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;

        // Create order items from cart with backend prices
        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            BigDecimal unitPrice = product.getSellingPrice();
            BigDecimal lineDiscount = product.getOriginalPrice()
                    .subtract(product.getSellingPrice())
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            ShopOrderItem orderItem = ShopOrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .discountAmount(lineDiscount)
                    .lineTotal(lineTotal)
                    .build();
            order.addItem(orderItem);

            subtotal = subtotal.add(lineTotal);
            totalDiscount = totalDiscount.add(lineDiscount);
        }

        order.setSubtotal(subtotal);
        order.setDiscountAmount(totalDiscount);
        order.setTotalAmount(subtotal);

        ShopOrder savedOrder = shopOrderRepository.save(order);

        // Deduct stock for each item (uses pessimistic locking)
        for (CartItem cartItem : cart.getItems()) {
            inventoryService.deductStock(cartItem.getProductId(), cartItem.getQuantity());
        }

        // Record status history
        ShopOrderStatusHistory history = ShopOrderStatusHistory.builder()
                .orderId(savedOrder.getId())
                .status("PENDING")
                .changedBy("SYSTEM")
                .notes("Order placed by customer " + customerId)
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        // Clear customer cart
        cartService.clearCart(customerId);

        log.info("Order {} created successfully for customer {}", orderNumber, customerId);
        return mapToOrderDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    public ShopOrderDTO getOrderById(Long id) {
        ShopOrder order = shopOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return mapToOrderDTO(order);
    }

    @Transactional(readOnly = true)
    public List<ShopOrderDTO> getAllOrders() {
        return shopOrderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShopOrderDTO> getOrdersByCustomer(Long customerId) {
        return shopOrderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShopOrderDTO> getOrdersByStatus(String status) {
        return shopOrderRepository.findByOrderStatus(status).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShopOrderDTO updateOrderStatus(Long orderId, OrderStatusUpdateDTO dto) {
        ShopOrder order = shopOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setOrderStatus(dto.getStatus());
        ShopOrder saved = shopOrderRepository.save(order);

        ShopOrderStatusHistory history = ShopOrderStatusHistory.builder()
                .orderId(orderId)
                .status(dto.getStatus())
                .changedBy("ADMIN")
                .notes(dto.getNotes())
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        log.info("Order {} status updated to {}", orderId, dto.getStatus());
        return mapToOrderDTO(saved);
    }

    @Transactional
    public ShopOrderDTO cancelOrder(Long orderId) {
        ShopOrder order = shopOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!"PENDING".equals(order.getOrderStatus()) && !"CONFIRMED".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("Only PENDING or CONFIRMED orders can be cancelled. Current status: " + order.getOrderStatus());
        }

        // Return stock for each item
        for (ShopOrderItem item : order.getItems()) {
            inventoryService.returnStock(item.getProductId(), item.getQuantity());
        }

        order.setOrderStatus("CANCELLED");
        order.setPaymentStatus("REFUNDED");
        ShopOrder saved = shopOrderRepository.save(order);

        ShopOrderStatusHistory history = ShopOrderStatusHistory.builder()
                .orderId(orderId)
                .status("CANCELLED")
                .changedBy("SYSTEM")
                .notes("Order cancelled and stock returned")
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        log.info("Order {} cancelled, stock returned", orderId);
        return mapToOrderDTO(saved);
    }

    private ShopOrderDTO mapToOrderDTO(ShopOrder order) {
        List<ShopOrderItemDTO> itemDTOs = order.getItems().stream().map(item -> {
            String productName = productRepository.findById(item.getProductId())
                    .map(Product::getName).orElse("Unknown");
            return ShopOrderItemDTO.builder()
                    .id(item.getId())
                    .productId(item.getProductId())
                    .productName(productName)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .discountAmount(item.getDiscountAmount())
                    .lineTotal(item.getLineTotal())
                    .build();
        }).collect(Collectors.toList());

        return ShopOrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .orderType(order.getOrderType())
                .deliveryAddress(order.getDeliveryAddress())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .items(itemDTOs)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
