package com.clubsphere.modules.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDashboardStats {
    private long totalMembers;
    private long activeMembers;
    private long expiredMembers;
    private long pendingPayments;
    private long goldMembers;
    private long silverMembers;
    private long juniorMembers;
    private BigDecimal monthlyRevenue;
    private List<MembershipResponseDto> recentMemberships;
}
