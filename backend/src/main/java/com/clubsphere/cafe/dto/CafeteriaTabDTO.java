package com.clubsphere.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * CafeteriaTabDTO — Data transfer object for a table running tab, including associated orders.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaTabDTO {

    private Long id;
    private Long tableId;
    private Integer tableNumber;
    private Long customerId;
    private BigDecimal runningTotal;
    private Boolean isOpen;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
    private List<CafeteriaOrderDTO> orders;
}
