package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.staff.dto.*;
import com.clubsphere.modules.staff.service.StaffService;
import com.clubsphere.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Management", description = "Endpoints for employee directory, departments and staff dashboard")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employees by name/code, department, status (Admin only)")
    public ResponseEntity<ApiResponse<List<EmployeeDto>>> searchEmployees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) String status
    ) {
        List<EmployeeDto> list = staffService.searchEmployees(query, departmentId, status);
        return ResponseEntity.ok(ApiResponse.success("Employees retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register new staff employee (Admin only)")
    public ResponseEntity<ApiResponse<EmployeeDto>> createEmployee(@Valid @RequestBody EmployeeCreateRequest req) {
        EmployeeDto created = staffService.createEmployee(req);
        return ResponseEntity.ok(ApiResponse.success("Employee created successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get employee details by ID")
    public ResponseEntity<ApiResponse<EmployeeDto>> getEmployeeById(@PathVariable Long id) {
        EmployeeDto emp = staffService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success("Employee retrieved", emp));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee details, designation, salary (Admin only)")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest req
    ) {
        EmployeeDto updated = staffService.updateEmployee(id, req);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee status (ACTIVE, INACTIVE, ON_LEAVE)")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        EmployeeDto updated = staffService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Employee status updated", updated));
    }

    @GetMapping("/departments")
    @Operation(summary = "List all club departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved", staffService.getAllDepartments()));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Staff dashboard metrics & department headcount (Admin only)")
    public ResponseEntity<ApiResponse<StaffDashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Staff dashboard stats", staffService.getDashboardStats()));
    }

    @GetMapping("/me")
    @Operation(summary = "Get logged-in staff profile")
    public ResponseEntity<ApiResponse<EmployeeDto>> getMyStaffProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Staff profile retrieved", staffService.getEmployeeByUserId(userDetails.getId())));
    }
}
