package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ShopOrderDTO — Detailed representation of a sports shop customer order and its line items.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopOrderDTO {

    private Long id;
    private String orderNumber;
    private Long customerId;
    private String orderType;
    private String deliveryAddress;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private List<ShopOrderItemDTO> items;
    private LocalDateTime createdAt;
}
