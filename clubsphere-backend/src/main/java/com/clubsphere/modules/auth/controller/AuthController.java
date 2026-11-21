package com.clubsphere.modules.auth.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.auth.dto.*;
import com.clubsphere.modules.auth.service.AuthService;
import com.clubsphere.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Authentication", description = "Endpoints for user login, student signup stages, 7-day trial and password recovery")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login using email and password")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new club member (single-step backwards compatible)")
    public ResponseEntity<ApiResponse<JwtResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        JwtResponse jwtResponse = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", jwtResponse));
    }

    // =========================================================================
    // MULTI-STAGE STUDENT SIGNUP
    // =========================================================================

    @PostMapping("/student/signup/stage1")
    @Operation(summary = "Stage 1: Submit personal details and send email OTP")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signupStage1(
            @Valid @RequestBody SignupStage1Request req
    ) {
        Map<String, Object> result = authService.signupStage1(req);
        return ResponseEntity.ok(ApiResponse.success("OTP dispatched to email", result));
    }

    @PostMapping("/student/signup/verify-otp")
    @Operation(summary = "Stage 2: Verify 6-digit email OTP")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifySignupOtp(
            @Valid @RequestBody VerifyOtpRequest req
    ) {
        Map<String, Object> result = authService.verifySignupOtp(req);
        return ResponseEntity.ok(ApiResponse.success("OTP verified", result));
    }

    @PostMapping("/student/signup/complete")
    @Operation(summary = "Stage 3: Set password, accept terms and activate student account")
    public ResponseEntity<ApiResponse<JwtResponse>> completeStudentSignup(
            @Valid @RequestBody CompleteStudentSignupRequest req
    ) {
        JwtResponse jwtResponse = authService.completeStudentSignup(req);
        return ResponseEntity.ok(ApiResponse.success("Student account created and authenticated successfully", jwtResponse));
    }

    // =========================================================================
    // 7-DAY FREE TRIAL
    // =========================================================================

    @PostMapping("/student/trial/start")
    @Operation(summary = "Activate 7-day free trial for current student")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startTrial(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required to activate trial"));
        }
        Map<String, Object> result = authService.start7DayTrial(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("7-Day Free Trial activated", result));
    }

    @GetMapping("/student/trial/status")
    @Operation(summary = "Check 7-day free trial status and days remaining")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrialStatus(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        Map<String, Object> result = authService.getTrialStatus(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Trial status retrieved", result));
    }

    // =========================================================================
    // PASSWORD RECOVERY / FORGOT PASSWORD
    // =========================================================================

    @PostMapping("/forgot-password/request")
    @Operation(summary = "Request password reset OTP via email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestPasswordReset(
            @Valid @RequestBody ForgotPasswordOtpRequest req
    ) {
        Map<String, Object> result = authService.requestPasswordReset(req);
        return ResponseEntity.ok(ApiResponse.success("Password reset instructions sent", result));
    }

    @PostMapping("/forgot-password/reset")
    @Operation(summary = "Verify OTP and set new password")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest req
    ) {
        Map<String, Object> result = authService.resetPasswordWithOtp(req);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", result));
    }

    // =========================================================================
    // PROFILE & PASSWORD CHANGE
    // =========================================================================

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<UserDetailsImpl>> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", userDetails));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for logged in user")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ChangePasswordRequest req
    ) {
        authService.changePassword(userDetails.getUsername(), req);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }
}
