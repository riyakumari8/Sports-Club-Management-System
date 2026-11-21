package com.clubsphere.cafe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CafeOrderStatusUpdateDTO — Request payload for transitioning an order status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeOrderStatusUpdateDTO {

    @NotBlank(message = "Status is required (e.g., PREPARING, READY, SERVED, COMPLETED, CANCELLED)")
    private String status;

    private String changedBy;

    private String notes;
}
