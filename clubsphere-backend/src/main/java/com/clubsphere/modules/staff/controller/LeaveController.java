package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.staff.dto.LeaveApplyRequest;
import com.clubsphere.modules.staff.dto.LeaveResponseDto;
import com.clubsphere.modules.staff.dto.LeaveReviewRequest;
import com.clubsphere.modules.staff.service.LeaveService;
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
@RequestMapping("/api/staff/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management", description = "Endpoints for leave applications, status checks and approvals")
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Apply for leave (Staff)")
    public ResponseEntity<ApiResponse<LeaveResponseDto>> applyLeave(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody LeaveApplyRequest req
    ) {
        LeaveResponseDto result = leaveService.applyLeave(userDetails.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Leave application submitted", result));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get personal leave requests for current logged-in employee")
    public ResponseEntity<ApiResponse<List<LeaveResponseDto>>> getMyLeaves(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<LeaveResponseDto> list = leaveService.getMyLeaves(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("My leaves retrieved", list));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all staff leave applications (Admin only)")
    public ResponseEntity<ApiResponse<List<LeaveResponseDto>>> getAllLeaves(@RequestParam(required = false) String status) {
        List<LeaveResponseDto> list = leaveService.getAllLeaves(status);
        return ResponseEntity.ok(ApiResponse.success("All leave applications retrieved", list));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve or reject a leave application with remarks (Admin only)")
    public ResponseEntity<ApiResponse<LeaveResponseDto>> reviewLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody LeaveReviewRequest req
    ) {
        LeaveResponseDto result = leaveService.reviewLeave(id, userDetails.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Leave application reviewed: " + req.getStatus(), result));
    }
}
