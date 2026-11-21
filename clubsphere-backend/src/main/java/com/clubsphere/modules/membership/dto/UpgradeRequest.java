package com.clubsphere.modules.membership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpgradeRequest {
    @NotNull(message = "New Plan ID is required")
    private Integer newPlanId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
