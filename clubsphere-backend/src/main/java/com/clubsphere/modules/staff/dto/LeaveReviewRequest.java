package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeaveReviewRequest {
    @NotBlank(message = "Status is required (APPROVED, REJECTED)")
    private String status;

    private String adminRemarks;
}
