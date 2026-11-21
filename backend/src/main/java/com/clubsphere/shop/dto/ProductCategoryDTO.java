package com.clubsphere.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ProductCategoryDTO — Data Transfer Object for ProductCategory responses and simple update/create requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategoryDTO {

    /**
     * Unique identifier of the category.
     */
    private Long id;

    /**
     * Name of the category.
     */
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name cannot exceed 100 characters")
    private String name;

    /**
     * Description of the category.
     */
    private String description;

    /**
     * Whether the category is active.
     */
    @Builder.Default
    private Boolean isActive = true;
}
