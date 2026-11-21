package com.clubsphere.modules.auth.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.auth.dto.ChangePasswordRequest;
import com.clubsphere.modules.auth.dto.JwtResponse;
import com.clubsphere.modules.auth.dto.LoginRequest;
import com.clubsphere.modules.auth.dto.RegisterRequest;
import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.repository.MemberRepository;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.Role;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.RoleRepository;
import com.clubsphere.modules.user.repository.UserRepository;
import com.clubsphere.security.JwtUtils;
import com.clubsphere.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail().trim().toLowerCase(), loginRequest.getPassword())
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

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .roles(roles)
                .memberId(memberId)
                .employeeId(employeeId)
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

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone().trim())
                .address(req.getAddress())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(memberRole)))
                .build();

        user = userRepository.save(user);

        // Auto-create Member profile
        int currentYear = LocalDate.now().getYear();
        String memberCode = String.format("CS-MB-%d-%04d", currentYear, user.getId());
        Member member = Member.builder()
                .user(user)
                .memberCode(memberCode)
                .status("ACTIVE")
                .build();
        member = memberRepository.save(member);

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
                .build();
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
