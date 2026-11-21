package com.clubsphere.modules.membership.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.membership.dto.PlanDto;
import com.clubsphere.modules.membership.service.MembershipPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships/plans")
@RequiredArgsConstructor
@Tag(name = "Membership Plans", description = "Endpoints for viewing and configuring membership plans")
public class MembershipPlanController {

    private final MembershipPlanService planService;

    @GetMapping
    @Operation(summary = "Get all active membership plans (Public)")
    public ResponseEntity<ApiResponse<List<PlanDto>>> getActivePlans() {
        return ResponseEntity.ok(ApiResponse.success("Active plans retrieved", planService.getAllActivePlans()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all plans including inactive (Admin only)")
    public ResponseEntity<ApiResponse<List<PlanDto>>> getAllPlansAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All plans retrieved", planService.getAllPlansAdmin()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get plan by ID")
    public ResponseEntity<ApiResponse<PlanDto>> getPlanById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success("Plan retrieved", planService.getPlanById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new membership plan (Admin only)")
    public ResponseEntity<ApiResponse<PlanDto>> createPlan(@Valid @RequestBody PlanDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Plan created successfully", planService.createPlan(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update membership plan details and pricing (Admin only)")
    public ResponseEntity<ApiResponse<PlanDto>> updatePlan(@PathVariable Integer id, @Valid @RequestBody PlanDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Plan updated successfully", planService.updatePlan(id, dto)));
    }
}
