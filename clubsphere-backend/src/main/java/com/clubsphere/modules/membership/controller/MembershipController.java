package com.clubsphere.modules.membership.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.membership.dto.*;
import com.clubsphere.modules.membership.service.MembershipService;
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
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
@Tag(name = "Membership Management", description = "Endpoints for membership subscriptions, renewals, dashboard and QR card")
public class MembershipController {

    private final MembershipService membershipService;

    @PostMapping("/register")
    @Operation(summary = "Subscribe or register for a membership plan")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> registerMembership(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody MembershipRegistrationRequest req
    ) {
        MembershipResponseDto result = membershipService.registerMembership(userDetails.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Membership registered successfully", result));
    }

    @PostMapping("/{id}/renew")
    @Operation(summary = "Renew an existing or expired membership")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> renewMembership(
            @PathVariable Long id,
            @Valid @RequestBody RenewalRequest req
    ) {
        MembershipResponseDto renewed = membershipService.renewMembership(id, req);
        return ResponseEntity.ok(ApiResponse.success("Membership renewed successfully", renewed));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current logged-in member's membership history")
    public ResponseEntity<ApiResponse<List<MembershipResponseDto>>> getMyMemberships(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<MembershipResponseDto> list = membershipService.getMyMemberships(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Membership records retrieved", list));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get all memberships (Admin/Staff only)")
    public ResponseEntity<ApiResponse<List<MembershipResponseDto>>> getAllMemberships() {
        List<MembershipResponseDto> list = membershipService.getAllMemberships();
        return ResponseEntity.ok(ApiResponse.success("All memberships retrieved", list));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get aggregate membership statistics (Admin/Staff only)")
    public ResponseEntity<ApiResponse<MembershipDashboardStats>> getDashboardStats() {
        MembershipDashboardStats stats = membershipService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Membership stats retrieved", stats));
    }

    @GetMapping("/{id}/card")
    @Operation(summary = "Generate and retrieve QR membership card")
    public ResponseEntity<ApiResponse<MemberCardDto>> getQrMembershipCard(@PathVariable Long id) {
        MemberCardDto card = membershipService.getQrMembershipCard(id);
        return ResponseEntity.ok(ApiResponse.success("QR Membership card generated", card));
    }
}
