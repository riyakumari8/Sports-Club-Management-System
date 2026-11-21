package com.clubsphere.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberVerificationResponse {
    private boolean valid;
    private Long memberId;
    private String memberCode;
    private String memberName;
    private String memberEmail;
    private String membershipNumber;
    private String planCategory; // GOLD, SILVER, JUNIOR
    private String planName;
    private String status; // ACTIVE, EXPIRED, etc.
    private LocalDate expiryDate;
    private boolean isCourtAccessAllowed;
    private int maxBookingDaysInAdvance;
    private double courtBookingDiscountPercent;
    private String message;
}
