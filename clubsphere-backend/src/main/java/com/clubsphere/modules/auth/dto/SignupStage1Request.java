package com.clubsphere.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupStage1Request {

    @NotBlank(message = "Full Name is required")
    @Size(min = 2, max = 80, message = "Full Name must be between 2 and 80 characters")
    @Pattern(regexp = "^[A-Za-z\\s'\\-]+$", message = "Full Name cannot contain numbers or special symbols")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
}
