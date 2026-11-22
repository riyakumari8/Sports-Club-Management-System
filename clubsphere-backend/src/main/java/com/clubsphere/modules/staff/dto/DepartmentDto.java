package com.clubsphere.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDto {
    private Integer id;
    private String name;
    private String code;
    private String description;
    private Boolean isActive;
    private long employeeCount;
}
