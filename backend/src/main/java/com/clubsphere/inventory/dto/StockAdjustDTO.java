package com.clubsphere.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * StockAdjustDTO — Request DTO for manual inventory stock adjustments (reconciliation).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAdjustDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "New quantity is required")
    @Min(value = 0, message = "New quantity must be greater than or equal to 0")
    private Integer newQuantity;

    private String reason;

    private Long recordedBy;
}
