package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.staff.dto.AttendanceMarkRequest;
import com.clubsphere.modules.staff.dto.AttendanceResponseDto;
import com.clubsphere.modules.staff.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance Management", description = "Endpoints for employee daily attendance and logs")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Mark or update daily employee attendance")
    public ResponseEntity<ApiResponse<AttendanceResponseDto>> markAttendance(@Valid @RequestBody AttendanceMarkRequest req) {
        AttendanceResponseDto result = attendanceService.markAttendance(req);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", result));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get attendance history for an employee")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDto>>> getAttendanceHistory(
            @RequestParam Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<AttendanceResponseDto> list = attendanceService.getEmployeeAttendanceHistory(employeeId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Attendance history retrieved", list));
    }

    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get club-wide attendance records for a specific date")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDto>>> getDailyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AttendanceResponseDto> list = attendanceService.getDailyAttendance(date);
        return ResponseEntity.ok(ApiResponse.success("Daily attendance retrieved", list));
    }
}
