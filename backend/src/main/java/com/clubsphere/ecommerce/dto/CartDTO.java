package com.clubsphere.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * CartDTO — Data transfer object representing a customer's shopping cart and line items.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {

    private Long id;
    private Long customerId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
}
