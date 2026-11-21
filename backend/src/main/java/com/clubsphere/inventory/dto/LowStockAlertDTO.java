package com.clubsphere.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LowStockAlertDTO — Data Transfer Object representing low or out-of-stock alerts for products.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockAlertDTO {

    private Long productId;
    private String productName;
    private Integer currentStock;
    private Integer minimumStock;
    private String stockStatus;
}
