package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalaryCreateRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Pay period month is required (1-12)")
    @Min(1) @Max(12)
    private Integer payPeriodMonth;

    @NotNull(message = "Pay period year is required")
    private Integer payPeriodYear;

    private BigDecimal baseSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;

    private String paymentStatus = "PENDING"; // PENDING, PAID
    private LocalDate paymentDate;
    private String paymentReference;
}
