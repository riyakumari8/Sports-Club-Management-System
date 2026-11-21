package com.clubsphere.cafe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CafeteriaTableDTO — Data transfer object representing a cafeteria dining table.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaTableDTO {

    private Long id;

    @NotNull(message = "Table number is required")
    private Integer tableNumber;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String status;

    private String location;
}
