package com.clubsphere.cafe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * CreateCafeOrderDTO — Request body for placing a new cafeteria order.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCafeOrderDTO {

    // Nullable for TAKEAWAY orders, required for DINE_IN
    private Long tableId;

    // Optional running tab ID
    private Long tabId;

    // Optional customer / member ID
    private Long customerId;

    @NotBlank(message = "Order type is required (e.g., DINE_IN, TAKEAWAY)")
    private String orderType;

    private String specialInstructions;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<CreateCafeOrderItemDTO> items;
}
