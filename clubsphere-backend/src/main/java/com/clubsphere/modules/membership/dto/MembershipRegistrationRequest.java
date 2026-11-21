package com.clubsphere.modules.membership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MembershipRegistrationRequest {
    @NotNull(message = "Plan ID is required")
    private Integer planId;

    @NotBlank(message = "Payment method is required (CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, CASH)")
    private String paymentMethod;

    private Long memberId; // Optional: Admin can register on behalf of another member
}
