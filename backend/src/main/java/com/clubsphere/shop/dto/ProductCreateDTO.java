package com.clubsphere.shop.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * ProductCreateDTO — Request payload for creating or updating a product in the Sports Shop.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCreateDTO {

    /**
     * ID of the category this product belongs to.
     */
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    /**
     * Name of the product.
     */
    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    private String name;

    /**
     * Detailed description of the product.
     */
    private String description;

    /**
     * Image URL for product display.
     */
    private String imageUrl;

    /**
     * Original retail price. Must be at least 0.
     */
    @NotNull(message = "Original price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Original price must be greater than or equal to 0")
    private BigDecimal originalPrice;

    /**
     * Discount percentage between 0 and 100.
     */
    @DecimalMin(value = "0.0", inclusive = true, message = "Discount percent must be greater than or equal to 0")
    @DecimalMax(value = "100.0", inclusive = true, message = "Discount percent cannot exceed 100")
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;
}
