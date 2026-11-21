package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * CafeteriaOrderItemDTO — Represents an individual ordered dish or drink line item.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaOrderItemDTO {

    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private String specialNote;
}
