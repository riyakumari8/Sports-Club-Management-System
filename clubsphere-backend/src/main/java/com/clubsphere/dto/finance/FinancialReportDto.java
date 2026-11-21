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
public class FinancialReportDto {
    private String reportType;
    private String reportTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netProfit;
    private BigDecimal totalRefunds;
    private BigDecimal pendingAmount;

    private int totalRecordsCount;
    private Map<String, Object> metadata;

    private List<?> detailedRows;
}
