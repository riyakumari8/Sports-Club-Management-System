package com.clubsphere.dto.finance;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequestDto {
    private BigDecimal refundAmount;
    private String refundReason;
}
