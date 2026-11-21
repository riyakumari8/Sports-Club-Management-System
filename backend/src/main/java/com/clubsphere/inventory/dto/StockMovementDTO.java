package com.clubsphere.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * StockMovementDTO — Data Transfer Object representing audit history of inventory stock movements.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String movementType;
    private Integer quantity;
    private Integer previousStock;
    private Integer updatedStock;
    private String reason;
    private Long recordedBy;
    private LocalDateTime createdAt;
}
