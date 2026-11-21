package com.clubsphere.cafe.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * CafeteriaPaymentDTO — Payload and response for processing a cafeteria order payment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaPaymentDTO {

    private Long id;

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Amount paid is required")
    @DecimalMin(value = "0.01", message = "Amount paid must be greater than 0")
    private BigDecimal amountPaid;

    @NotBlank(message = "Payment method is required (e.g., CASH, CARD, UPI)")
    private String paymentMethod;

    private String paymentStatus;

    private String transactionReference;
}
