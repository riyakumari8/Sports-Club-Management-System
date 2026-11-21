package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeUpdateRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;

    private Integer departmentId;
    private String designation;
    private String employmentStatus;
    private String employmentType;

    @DecimalMin(value = "0.0")
    private BigDecimal baseSalary;
}
