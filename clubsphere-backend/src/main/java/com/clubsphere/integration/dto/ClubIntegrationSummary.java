package com.clubsphere.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubIntegrationSummary {
    private long totalUsers;
    private long totalMembers;
    private long activeMembers;
    private long expiredMembers;
    private long totalEmployees;
    private long activeEmployees;
    private BigDecimal monthlyMembershipRevenue;
    private BigDecimal monthlyPayrollExpense;
}
