package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * MenuItemDTO — Detailed information for a menu item, including computed effectivePrice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDTO {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal discountPercent;
    private BigDecimal effectivePrice;
    private Boolean isAvailable;
}
