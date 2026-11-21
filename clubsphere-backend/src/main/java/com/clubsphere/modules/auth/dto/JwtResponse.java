package com.clubsphere.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private List<String> roles;
    private Long memberId;
    private Long employeeId;
    private String studentId;
    private String trialStatus;
    private Long trialDaysRemaining;
}
