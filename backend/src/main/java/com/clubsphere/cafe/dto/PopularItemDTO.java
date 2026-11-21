package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PopularItemDTO — Aggregated count of how many times a menu item was ordered.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopularItemDTO {

    private String menuItemName;
    private Long quantitySold;
}
