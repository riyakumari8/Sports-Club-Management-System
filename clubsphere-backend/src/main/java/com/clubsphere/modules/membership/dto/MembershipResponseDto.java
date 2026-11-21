package com.clubsphere.modules.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipResponseDto {
    private Long id;
    private Long memberId;
    private String memberCode;
    private String memberName;
    private String memberEmail;
    private Integer planId;
    private String planName;
    private String planCategory;
    private BigDecimal planPrice;
    private String membershipNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String qrCodeToken;
    private Boolean autoRenew;
    private LocalDateTime createdAt;
    private boolean isExpired;
}
