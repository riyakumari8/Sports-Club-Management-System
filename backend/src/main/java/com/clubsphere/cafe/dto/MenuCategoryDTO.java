package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * MenuCategoryDTO — Data transfer object representing a menu category.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuCategoryDTO {

    private Long id;
    private String name;
    private String description;
    private Boolean isActive;
}
