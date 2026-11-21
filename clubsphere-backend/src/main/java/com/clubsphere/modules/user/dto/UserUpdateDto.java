package com.clubsphere.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserUpdateDto {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email
    private String email;

    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private List<String> roles;
}
