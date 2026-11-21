package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * ShopOrderItemDTO — Line item details for a shop order.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopOrderItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountAmount;
    private BigDecimal lineTotal;
}
