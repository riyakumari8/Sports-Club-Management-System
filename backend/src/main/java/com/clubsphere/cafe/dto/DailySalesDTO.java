package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DailySalesDTO — Aggregated sales metrics and popular items for a specific date.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailySalesDTO {

    private LocalDate date;
    private Long totalOrders;
    private Long completedOrders;
    private Long pendingOrders;
    private BigDecimal totalRevenue;
    private List<PopularItemDTO> popularItems;
}
