package com.clubsphere.modules.membership.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RenewalRequest {
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
