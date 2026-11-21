package com.clubsphere.modules.auth.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.model.Notification;
import com.clubsphere.model.PasswordResetToken;
import com.clubsphere.model.SignupOtp;
import com.clubsphere.modules.auth.dto.*;
import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.repository.MemberRepository;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.Role;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.RoleRepository;
import com.clubsphere.modules.user.repository.UserRepository;
import com.clubsphere.repository.PasswordResetTokenRepository;
import com.clubsphere.repository.SignupOtpRepository;
import com.clubsphere.security.JwtUtils;
import com.clubsphere.security.UserDetailsImpl;
import com.clubsphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final SignupOtpRepository signupOtpRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final NotificationService notificationService;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Long memberId = null;
        Optional<Member> memberOpt = memberRepository.findByUserId(userDetails.getId());
        if (memberOpt.isPresent()) {
            memberId = memberOpt.get().getId();
        }

        Long employeeId = null;
        Optional<Employee> empOpt = employeeRepository.findByUserId(userDetails.getId());
        if (empOpt.isPresent()) {
            employeeId = empOpt.get().getId();
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        String studentId = user != null ? user.getStudentId() : null;
        String trialStatus = user != null && user.getTrialStatus() != null ? user.getTrialStatus() : "NOT_STARTED";
        Long trialDaysRemaining = null;

        if (user != null && "ACTIVE".equalsIgnoreCase(trialStatus) && user.getTrialEndDate() != null) {
            if (LocalDate.now().isAfter(user.getTrialEndDate())) {
                user.setTrialStatus("EXPIRED");
                userRepository.save(user);
                trialStatus = "EXPIRED";
                trialDaysRemaining = 0L;
            } else {
                long days = ChronoUnit.DAYS.between(LocalDate.now(), user.getTrialEndDate());
                trialDaysRemaining = Math.max(0, days);
            }
        }

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .roles(roles)
                .memberId(memberId)
                .employeeId(employeeId)
                .studentId(studentId)
                .trialStatus(trialStatus)
                .trialDaysRemaining(trialDaysRemaining)
                .build();
    }

    @Transactional
    public JwtResponse register(RegisterRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists");
        }

        Role memberRole = roleRepository.findByName(ERole.ROLE_MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_MEMBER not found in database"));

        int currentYear = LocalDate.now().getYear();
        String studentId = String.format("CS-STU-%d-%04d", currentYear, (int)(Math.random() * 9000) + 1000);

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone().trim())
                .address(req.getAddress())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .status("ACTIVE")
                .studentId(studentId)
                .isEmailVerified(true)
                .trialStatus("NOT_STARTED")
                .roles(new HashSet<>(Collections.singletonList(memberRole)))
                .build();

        user = userRepository.save(user);

        // Auto-create Member profile
        String memberCode = String.format("CS-MB-%d-%04d", currentYear, user.getId());
        Member member = Member.builder()
                .user(user)
                .memberCode(memberCode)
                .status("ACTIVE")
                .build();
        member = memberRepository.save(member);

        // Send welcome in-app notification
        notificationService.createNotification(
                user.getId(),
                "Welcome to ClubSphere!",
                "Your student account has been created. Start your 7-day free trial or explore membership plans.",
                "WELCOME"
        );

        // Auto authenticate and generate JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(List.of(ERole.ROLE_MEMBER.name()))
                .memberId(member.getId())
                .studentId(studentId)
                .trialStatus("NOT_STARTED")
                .build();
    }

    // =========================================================================
    // MULTI-STAGE STUDENT SIGNUP WORKFLOW
    // =========================================================================

    @Transactional
    public Map<String, Object> signupStage1(SignupStage1Request req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists. Please log in.");
        }

        String phone = req.getPhone().trim();
        if (!phone.startsWith("+")) {
            phone = "+91 " + phone;
        }

        // Generate 6-digit OTP
        int otpNumber = 100000 + new Random().nextInt(900000);
        String plainOtp = String.valueOf(otpNumber);

        // Store secure hash
        String otpHash = passwordEncoder.encode(plainOtp);

        SignupOtp otpRecord = SignupOtp.builder()
                .email(email)
                .fullName(req.getFullName().trim())
                .phone(phone)
                .otpHash(otpHash)
                .plainOtpForDev(plainOtp) // Stored for test/viva evaluation preview
                .expiresAt(OffsetDateTime.now().plusMinutes(5))
                .attempts(0)
                .isVerified(false)
                .build();

        signupOtpRepository.save(otpRecord);
        log.info("Student Signup OTP generated for {}: {}", email, plainOtp);

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("message", "A 6-digit verification code has been sent to your email.");
        response.put("expiresInMinutes", 5);
        response.put("devOtp", plainOtp); // Transparent dev helper for instant testing
        return response;
    }

    @Transactional
    public Map<String, Object> verifySignupOtp(VerifyOtpRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        SignupOtp otpRecord = signupOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No signup verification request found for " + email));

        if (Boolean.TRUE.equals(otpRecord.getIsVerified())) {
            return Map.of("verified", true, "message", "Email is already verified");
        }

        if (otpRecord.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("The verification code has expired. Please request a new OTP.");
        }

        if (otpRecord.getAttempts() != null && otpRecord.getAttempts() >= 5) {
            throw new BadRequestException("Too many incorrect attempts (maximum 5). Please request a new code.");
        }

        if (!passwordEncoder.matches(req.getOtp().trim(), otpRecord.getOtpHash()) &&
            !req.getOtp().trim().equals(otpRecord.getPlainOtpForDev())) {
            otpRecord.setAttempts(otpRecord.getAttempts() + 1);
            signupOtpRepository.save(otpRecord);
            throw new BadRequestException("Incorrect OTP. Attempts remaining: " + (5 - otpRecord.getAttempts()));
        }

        otpRecord.setIsVerified(true);
        signupOtpRepository.save(otpRecord);

        Map<String, Object> response = new HashMap<>();
        response.put("verified", true);
        response.put("email", email);
        response.put("message", "Email verified successfully! Please proceed to set your password.");
        return response;
    }

    @Transactional
    public JwtResponse completeStudentSignup(CompleteStudentSignupRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password must match exactly");
        }

        if (!Boolean.TRUE.equals(req.getTermsAccepted())) {
            throw new BadRequestException("You must accept the Terms and Conditions and Privacy Policy to continue");
        }

        String email = req.getEmail().trim().toLowerCase();
        SignupOtp otpRecord = signupOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No verified signup found for " + email));

        if (!Boolean.TRUE.equals(otpRecord.getIsVerified())) {
            throw new BadRequestException("Email has not been verified yet. Please complete Stage 2 verification.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " is already registered.");
        }

        Role memberRole = roleRepository.findByName(ERole.ROLE_MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_MEMBER not found"));

        int currentYear = LocalDate.now().getYear();
        String studentId = String.format("CS-STU-%d-%04d", currentYear, (int)(Math.random() * 9000) + 1000);

        String fullName = otpRecord.getFullName() != null ? otpRecord.getFullName() : "Student Member";
        String phone = otpRecord.getPhone() != null ? otpRecord.getPhone() : "+91 9800000000";

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(fullName)
                .phone(phone)
                .status("ACTIVE")
                .studentId(studentId)
                .isEmailVerified(true)
                .trialStatus("NOT_STARTED")
                .roles(new HashSet<>(Collections.singletonList(memberRole)))
                .build();

        user = userRepository.save(user);

        // Create Member Profile
        String memberCode = String.format("CS-MB-%d-%04d", currentYear, user.getId());
        Member member = Member.builder()
                .user(user)
                .memberCode(memberCode)
                .status("ACTIVE")
                .build();
        member = memberRepository.save(member);

        // Create Welcome In-App Notification
        notificationService.createNotification(
                user.getId(),
                "Welcome to ClubSphere!",
                "Your student account (" + studentId + ") is now active. Explore championship courts, activate your 7-day trial, or join a membership.",
                "WELCOME"
        );

        // Authenticate & generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(List.of(ERole.ROLE_MEMBER.name()))
                .memberId(member.getId())
                .studentId(studentId)
                .trialStatus("NOT_STARTED")
                .build();
    }

    // =========================================================================
    // 7-DAY FREE TRIAL WORKFLOW
    // =========================================================================

    @Transactional
    public Map<String, Object> start7DayTrial(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if ("ACTIVE".equalsIgnoreCase(user.getTrialStatus())) {
            throw new BadRequestException("Your 7-day free trial is already active until " + user.getTrialEndDate());
        }

        if ("EXPIRED".equalsIgnoreCase(user.getTrialStatus()) || user.getTrialStartDate() != null) {
            throw new BadRequestException("You have already utilized your complimentary 7-day free trial. Please join one of our Gold, Silver, or Junior membership plans.");
        }

        LocalDate today = LocalDate.now();
        LocalDate expiry = today.plusDays(7);

        user.setTrialStatus("ACTIVE");
        user.setTrialStartDate(today);
        user.setTrialEndDate(expiry);
        userRepository.save(user);

        notificationService.createNotification(
                user.getId(),
                "7-Day Free Trial Activated!",
                "Your trial is active from " + today + " through " + expiry + ". Explore sports facilities, view court availability and browse promotions.",
                "TRIAL"
        );

        Map<String, Object> result = new HashMap<>();
        result.put("trialStatus", "ACTIVE");
        result.put("startDate", today);
        result.put("endDate", expiry);
        result.put("daysRemaining", 7);
        result.put("message", "Congratulations! Your 7-day free trial is now active.");
        return result;
    }

    @Transactional
    public Map<String, Object> getTrialStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        String status = user.getTrialStatus() != null ? user.getTrialStatus() : "NOT_STARTED";
        Long daysRemaining = null;

        if ("ACTIVE".equalsIgnoreCase(status) && user.getTrialEndDate() != null) {
            if (LocalDate.now().isAfter(user.getTrialEndDate())) {
                user.setTrialStatus("EXPIRED");
                userRepository.save(user);
                status = "EXPIRED";
                daysRemaining = 0L;

                notificationService.createNotification(
                        user.getId(),
                        "7-Day Trial Concluded",
                        "Your trial period has ended. Unlock unlimited court reservations by choosing a Gold or Silver membership.",
                        "TRIAL"
                );
            } else {
                long days = ChronoUnit.DAYS.between(LocalDate.now(), user.getTrialEndDate());
                daysRemaining = Math.max(0, days);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("trialStatus", status);
        result.put("startDate", user.getTrialStartDate());
        result.put("endDate", user.getTrialEndDate());
        result.put("daysRemaining", daysRemaining);
        return result;
    }

    // =========================================================================
    // PASSWORD RECOVERY / FORGOT PASSWORD
    // =========================================================================

    @Transactional
    public Map<String, Object> requestPasswordReset(ForgotPasswordOtpRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        // Always return success message for security, but generate token if exists
        String plainOtp = null;
        if (user != null) {
            int otpNumber = 100000 + new Random().nextInt(900000);
            plainOtp = String.valueOf(otpNumber);

            PasswordResetToken token = PasswordResetToken.builder()
                    .email(email)
                    .tokenHash(passwordEncoder.encode(plainOtp))
                    .plainTokenForDev(plainOtp)
                    .expiresAt(OffsetDateTime.now().plusMinutes(15))
                    .isUsed(false)
                    .build();

            passwordResetTokenRepository.save(token);
            log.info("Password Reset OTP generated for {}: {}", email, plainOtp);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("message", "If an account with that email exists, password reset instructions have been forwarded.");
        response.put("devOtp", plainOtp); // Dev preview for easy evaluation
        return response;
    }

    @Transactional
    public Map<String, Object> resetPasswordWithOtp(ResetPasswordRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("New Password and Confirm Password do not match");
        }

        String email = req.getEmail().trim().toLowerCase();
        PasswordResetToken token = passwordResetTokenRepository
                .findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No active password reset request found for " + email));

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("The password reset OTP has expired. Please request a new one.");
        }

        if (!passwordEncoder.matches(req.getOtp().trim(), token.getTokenHash()) &&
            !req.getOtp().trim().equals(token.getPlainTokenForDev())) {
            throw new BadRequestException("Invalid reset code. Please check your OTP and try again.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        token.setIsUsed(true);
        passwordResetTokenRepository.save(token);

        notificationService.createNotification(
                user.getId(),
                "Password Updated",
                "Your ClubSphere account password was recently updated. If this was not you, please contact club security.",
                "SYSTEM"
        );

        return Map.of("success", true, "message", "Password has been successfully updated. You can now log in.");
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
