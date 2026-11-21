package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ShiftAssignRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Shift ID is required")
    private Integer shiftId;

    @NotNull(message = "Schedule date is required")
    private LocalDate scheduleDate;
}
