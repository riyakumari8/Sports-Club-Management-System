package com.clubsphere.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CheckoutDTO — Request payload for checking out an active cart into a placed ShopOrder.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutDTO {

    @NotBlank(message = "Order type is required (e.g., ONLINE, PICKUP)")
    private String orderType;

    private String deliveryAddress;

    @NotBlank(message = "Payment method is required (e.g., CASH, CARD, UPI, ONLINE)")
    private String paymentMethod;
}
