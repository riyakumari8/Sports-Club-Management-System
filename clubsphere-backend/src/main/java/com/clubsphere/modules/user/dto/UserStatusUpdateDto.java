package com.clubsphere.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserStatusUpdateDto {
    @NotBlank(message = "Status is required (ACTIVE, INACTIVE, SUSPENDED)")
    private String status;
}
