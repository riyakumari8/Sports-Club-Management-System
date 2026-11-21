package com.clubsphere.dto.finance;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationDto {
    private BigDecimal totalOnlinePayments;
    private BigDecimal totalCashPayments;
    private BigDecimal totalRefunds;
    private BigDecimal totalDiscrepancy;

    private int totalOnlineCount;
    private int totalCashCount;
    private int totalRefundedCount;
    private int pendingReviewCount;

    private List<?> cashTransactions;
    private List<?> pendingOrDiscrepantTransactions;
}
