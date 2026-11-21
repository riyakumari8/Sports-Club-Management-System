package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * CafeteriaOrderDTO — Detailed representation of a cafe order and its items.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaOrderDTO {

    private Long id;
    private String orderNumber;
    private Integer tableNumber;
    private Long tabId;
    private Long customerId;
    private String orderType;
    private String orderStatus;
    private List<CafeteriaOrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private LocalDateTime createdAt;
}
