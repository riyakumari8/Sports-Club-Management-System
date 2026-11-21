package com.clubsphere.dto.finance;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceDashboardDto {
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private BigDecimal pendingAmount;
    private BigDecimal totalRefunds;

    private long totalCompletedCount;
    private long totalPendingCount;
    private long totalFailedCount;
    private long totalRefundedCount;

    private String filterPeriod;
    private LocalDate startDate;
    private LocalDate endDate;

    private Map<String, BigDecimal> revenueByModule;
    private Map<String, BigDecimal> expensesByCategory;
    private Map<String, BigDecimal> revenueByPaymentMethod;

    private List<?> recentPayments;
    private List<?> activeAlerts;
}
