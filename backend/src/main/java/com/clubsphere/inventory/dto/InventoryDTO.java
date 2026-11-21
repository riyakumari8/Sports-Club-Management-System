package com.clubsphere.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * InventoryDTO — Data Transfer Object representing current inventory status for a product.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String categoryName;
    private Integer quantityInStock;
    private Integer minimumStockThreshold;
    private String stockStatus;
    private LocalDateTime lastUpdated;
}
