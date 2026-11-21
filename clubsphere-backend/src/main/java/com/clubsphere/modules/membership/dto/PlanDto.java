package com.clubsphere.modules.membership.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDto {
    private Integer id;

    @NotBlank(message = "Plan code is required")
    private String planCode;

    @NotBlank(message = "Plan name is required")
    private String name;

    @NotBlank(message = "Category is required (GOLD, SILVER, JUNIOR)")
    private String category;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Duration in days is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    private Integer minAge;
    private Integer maxAge;
    private String benefits;
    private Boolean isActive;
}
