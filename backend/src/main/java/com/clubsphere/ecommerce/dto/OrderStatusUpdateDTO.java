package com.clubsphere.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderStatusUpdateDTO — Request payload for updating the status of an existing shop order.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusUpdateDTO {

    @NotBlank(message = "Order status is required (e.g., CONFIRMED, PROCESSING, READY_FOR_PICKUP, SHIPPED, DELIVERED, CANCELLED)")
    private String status;

    private String notes;
}
