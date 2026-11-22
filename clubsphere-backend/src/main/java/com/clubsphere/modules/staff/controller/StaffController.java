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
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Management", description = "Endpoints for employee directory, departments and staff dashboard")
public class StaffController {

    private final StaffService staffService;
    private final com.clubsphere.modules.staff.service.StaffDepartmentService staffDepartmentService;

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
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Staff dashboard metrics & department-isolated summary")
    public ResponseEntity<ApiResponse<Object>> getDashboardStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false, defaultValue = "false") boolean adminOverview
    ) {
        boolean isAdmin = userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin && adminOverview) {
            return ResponseEntity.ok(ApiResponse.success("Staff admin stats", staffService.getDashboardStats()));
        }
        return ResponseEntity.ok(ApiResponse.success("Staff department dashboard", staffDepartmentService.getStaffDashboard(userDetails.getId())));
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get permitted actions for logged-in staff member")
    public ResponseEntity<ApiResponse<List<String>>> getMyPermissions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Permissions retrieved", staffDepartmentService.getStaffPermissions(userDetails.getId())));
    }

    @PatchMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update permitted personal profile fields (phone, address)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> payload
    ) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", staffDepartmentService.updateStaffProfile(userDetails.getId(), payload)));
    }

    @PostMapping("/attendance/clock-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Clock in for today")
    public ResponseEntity<ApiResponse<Map<String, Object>>> clockIn(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Clock in successful", staffDepartmentService.clockIn(userDetails.getId())));
    }

    @PostMapping("/attendance/clock-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Clock out for today")
    public ResponseEntity<ApiResponse<Map<String, Object>>> clockOut(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Clock out successful", staffDepartmentService.clockOut(userDetails.getId())));
    }

    @GetMapping("/attendance/my-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "View personal attendance history")
    public ResponseEntity<ApiResponse<Object>> getMyAttendanceHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Attendance history retrieved", staffDepartmentService.getMyAttendance(userDetails.getId())));
    }

    @GetMapping("/shifts/my-shifts")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "View personal assigned shifts")
    public ResponseEntity<ApiResponse<Object>> getMyShifts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Assigned shifts retrieved", staffDepartmentService.getMyShifts(userDetails.getId())));
    }

    @GetMapping("/me")
    @Operation(summary = "Get logged-in staff profile")
    public ResponseEntity<ApiResponse<EmployeeDto>> getMyStaffProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        EmployeeDto emp = staffService.getEmployeeByUserId(userDetails.getId());
        if (emp != null) {
            emp.setPermissions(staffDepartmentService.getStaffPermissions(userDetails.getId()));
        }
        return ResponseEntity.ok(ApiResponse.success("Staff profile retrieved", emp));
    }
}
