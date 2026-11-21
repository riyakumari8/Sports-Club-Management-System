package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.staff.dto.ShiftAssignRequest;
import com.clubsphere.modules.staff.dto.ShiftDto;
import com.clubsphere.modules.staff.dto.ShiftScheduleResponseDto;
import com.clubsphere.modules.staff.service.ShiftService;
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
@RequestMapping("/api/staff/shifts")
@RequiredArgsConstructor
@Tag(name = "Shift Management", description = "Endpoints for employee shifts and scheduling")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    @Operation(summary = "Get list of all standard work shifts")
    public ResponseEntity<ApiResponse<List<ShiftDto>>> getAllShifts() {
        return ResponseEntity.ok(ApiResponse.success("Shifts retrieved", shiftService.getAllShifts()));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign a shift to an employee for a specific date (Admin only)")
    public ResponseEntity<ApiResponse<ShiftScheduleResponseDto>> assignShift(@Valid @RequestBody ShiftAssignRequest req) {
        ShiftScheduleResponseDto result = shiftService.assignShift(req);
        return ResponseEntity.ok(ApiResponse.success("Shift assigned successfully", result));
    }

    @GetMapping("/schedules")
    @Operation(summary = "Get all shift schedules for a specific date")
    public ResponseEntity<ApiResponse<List<ShiftScheduleResponseDto>>> getDailySchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<ShiftScheduleResponseDto> list = shiftService.getDailySchedules(date);
        return ResponseEntity.ok(ApiResponse.success("Shift schedules retrieved", list));
    }
}
