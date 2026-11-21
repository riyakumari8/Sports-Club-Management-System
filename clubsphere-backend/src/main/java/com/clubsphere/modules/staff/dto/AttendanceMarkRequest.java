package com.clubsphere.modules.staff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceMarkRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotBlank(message = "Status is required (PRESENT, ABSENT, HALF_DAY, ON_LEAVE)")
    private String status;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private String remarks;
}
