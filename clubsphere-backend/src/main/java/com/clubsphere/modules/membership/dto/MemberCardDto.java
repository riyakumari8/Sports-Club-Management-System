package com.clubsphere.modules.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberCardDto {
    private String clubName;
    private String memberName;
    private String memberCode;
    private String membershipNumber;
    private String planCategory;
    private String planName;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private String status;
    private String qrCodeToken;
    private String qrCodeBase64;
    private String bloodGroup;
    private String emergencyPhone;
}
