package com.clubsphere.cafe.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * MenuItemCreateDTO — Request payload for creating or updating a menu item with validations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemCreateDTO {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Item name is required")
    @Size(max = 200, message = "Item name cannot exceed 200 characters")
    private String name;

    private String description;

    private String imageUrl;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be greater than or equal to 0")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount percent must be at least 0")
    @DecimalMax(value = "100.0", inclusive = true, message = "Discount percent cannot exceed 100")
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Builder.Default
    private Boolean isAvailable = true;
}
