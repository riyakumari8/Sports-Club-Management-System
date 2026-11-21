package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * CounterSaleResponseDTO — Response payload returned after recording a counter sale.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterSaleResponseDTO {

    private Long id;
    private String receiptNumber;
    private String customerName;
    private List<?> items;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime saleTime;
}
