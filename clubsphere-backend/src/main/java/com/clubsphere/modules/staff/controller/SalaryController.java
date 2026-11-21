package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.staff.dto.SalaryCreateRequest;
import com.clubsphere.modules.staff.dto.SalaryResponseDto;
import com.clubsphere.modules.staff.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/salary")
@RequiredArgsConstructor
@Tag(name = "Salary Management", description = "Endpoints for employee salary records (Admin only)")
public class SalaryController {

    private final SalaryService salaryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create or update monthly salary record (Admin only)")
    public ResponseEntity<ApiResponse<SalaryResponseDto>> createOrUpdateSalary(@Valid @RequestBody SalaryCreateRequest req) {
        SalaryResponseDto result = salaryService.createOrUpdateSalary(req);
        return ResponseEntity.ok(ApiResponse.success("Salary record saved", result));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get salary records by month and year (Admin only)")
    public ResponseEntity<ApiResponse<List<SalaryResponseDto>>> getSalaryRecords(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        List<SalaryResponseDto> list = salaryService.getSalaryRecordsForPeriod(month, year);
        return ResponseEntity.ok(ApiResponse.success("Salary records retrieved", list));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get complete salary history for an employee (Admin only)")
    public ResponseEntity<ApiResponse<List<SalaryResponseDto>>> getEmployeeSalaryHistory(@PathVariable Long employeeId) {
        List<SalaryResponseDto> list = salaryService.getEmployeeSalaryHistory(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee salary history", list));
    }
}
