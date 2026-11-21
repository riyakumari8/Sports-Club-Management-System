package com.clubsphere.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * CounterSaleDTO — Request payload for recording a walk-in / POS purchase at the counter.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterSaleDTO {

    private Long staffId;

    private String customerName;

    @NotBlank(message = "Payment method is required (e.g., CASH, CARD, UPI)")
    private String paymentMethod;

    @NotEmpty(message = "Counter sale items cannot be empty")
    @Valid
    private List<CounterSaleItemDTO> items;
}
