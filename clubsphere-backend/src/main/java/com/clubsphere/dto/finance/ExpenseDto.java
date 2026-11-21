package com.clubsphere.dto.finance;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private String expenseReference;
    private String category;
    private String description;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String paymentMethod;
    private String vendorName;
    private String receiptUrl;
    private Long recordedByUserId;
    private String recordedByName;
}
