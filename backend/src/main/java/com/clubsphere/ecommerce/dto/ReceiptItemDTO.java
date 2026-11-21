package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * ReceiptItemDTO — Represents an individual line item on a customer receipt.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemDTO {

    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountAmount;
    private BigDecimal lineTotal;
}
