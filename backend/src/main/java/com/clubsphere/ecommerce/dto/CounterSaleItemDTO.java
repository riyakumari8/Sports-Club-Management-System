package com.clubsphere.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * CounterSaleItemDTO — Individual line item in a counter sale request or response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterSaleItemDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    private String productName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal discountAmount;

    private BigDecimal lineTotal;
}
