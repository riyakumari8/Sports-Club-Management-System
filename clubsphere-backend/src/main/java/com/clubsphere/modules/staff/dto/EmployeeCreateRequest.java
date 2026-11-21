package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeCreateRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String address;
    private LocalDate dateOfBirth;
    private String gender;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    private String employmentType = "FULL_TIME";

    @NotNull(message = "Base salary is required")
    @DecimalMin(value = "0.0", message = "Base salary must be non-negative")
    private BigDecimal baseSalary;
}
