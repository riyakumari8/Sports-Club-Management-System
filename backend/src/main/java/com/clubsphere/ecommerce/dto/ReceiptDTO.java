package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ReceiptDTO — Consolidated transaction receipt for customer purchases (online orders or counter sales).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptDTO {

    private String receiptNumber;
    private String orderNumber;
    private String customerName;
    private List<?> items;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private LocalDateTime transactionDate;
}
