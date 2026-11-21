package com.clubsphere.modules.user.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.user.dto.UserStatusUpdateDto;
import com.clubsphere.modules.user.dto.UserSummaryDto;
import com.clubsphere.modules.user.dto.UserUpdateDto;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.Role;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.RoleRepository;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getAllUsers(String query, String status) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : null;

        return userRepository.searchUsers(cleanQuery, cleanStatus).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToSummaryDto(user);
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToSummaryDto(user);
    }

    @Transactional
    public UserSummaryDto updateUser(Long id, UserUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail().toLowerCase())) {
                throw new BadRequestException("Email is already taken: " + dto.getEmail());
            }
            user.setEmail(dto.getEmail().toLowerCase());
        }

        user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> newRoles = new HashSet<>();
            for (String r : dto.getRoles()) {
                try {
                    ERole eRole = ERole.valueOf(r.startsWith("ROLE_") ? r : "ROLE_" + r);
                    Role role = roleRepository.findByName(eRole)
                            .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + r));
                    newRoles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role: " + r);
                }
            }
            user.setRoles(newRoles);
        }

        return mapToSummaryDto(userRepository.save(user));
    }

    @Transactional
    public UserSummaryDto updateUserStatus(Long id, UserStatusUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        String status = dto.getStatus().trim().toUpperCase();
        if (!List.of("ACTIVE", "INACTIVE", "SUSPENDED").contains(status)) {
            throw new BadRequestException("Status must be ACTIVE, INACTIVE, or SUSPENDED");
        }

        user.setStatus(status);
        return mapToSummaryDto(userRepository.save(user));
    }

    public UserSummaryDto mapToSummaryDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .status(user.getStatus())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
