package com.clubsphere.modules.user.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.user.dto.UserStatusUpdateDto;
import com.clubsphere.modules.user.dto.UserSummaryDto;
import com.clubsphere.modules.user.dto.UserUpdateDto;
import com.clubsphere.modules.user.service.UserService;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Admin and User Profile APIs")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search and filter all users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getAllUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status
    ) {
        List<UserSummaryDto> users = userService.getAllUsers(query, status);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user details by ID (Admin only)")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getUserById(@PathVariable Long id) {
        UserSummaryDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user details and roles (Admin only)")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto dto
    ) {
        UserSummaryDto updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate or deactivate user account (Admin only)")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateDto dto
    ) {
        UserSummaryDto updated = userService.updateUserStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get personal profile of currently logged-in user")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserSummaryDto profile = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update personal profile of currently logged-in user")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UserUpdateDto dto
    ) {
        dto.setRoles(null); // Members cannot change their own roles
        UserSummaryDto updated = userService.updateUser(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
