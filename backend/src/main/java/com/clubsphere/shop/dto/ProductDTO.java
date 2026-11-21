package com.clubsphere.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ProductDTO — Data Transfer Object representing a product with its category details
 * and real-time inventory status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    /**
     * Product ID.
     */
    private Long id;

    /**
     * Associated category ID.
     */
    private Long categoryId;

    /**
     * Associated category name.
     */
    private String categoryName;

    /**
     * Product name.
     */
    private String name;

    /**
     * Product description.
     */
    private String description;

    /**
     * Product image URL.
     */
    private String imageUrl;

    /**
     * Original price before discounts.
     */
    private BigDecimal originalPrice;

    /**
     * Discount percentage.
     */
    private BigDecimal discountPercent;

    /**
     * Effective selling price (after discount).
     */
    private BigDecimal sellingPrice;

    /**
     * Product active status.
     */
    private Boolean isActive;

    /**
     * Current stock level from Inventory.
     */
    private Integer stockQuantity;

    /**
     * Stock status from Inventory ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK').
     */
    private String stockStatus;

    /**
     * Product creation timestamp.
     */
    private LocalDateTime createdAt;
}
