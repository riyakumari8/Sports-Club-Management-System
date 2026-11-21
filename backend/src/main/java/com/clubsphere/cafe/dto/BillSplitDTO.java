package com.clubsphere.cafe.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * BillSplitDTO — Single person's split payment allocation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillSplitDTO {

    private String payerName;

    @NotNull(message = "Split amount is required")
    @DecimalMin(value = "0.01", message = "Split amount must be greater than 0")
    private BigDecimal amount;

    private String paymentMethod;
}
