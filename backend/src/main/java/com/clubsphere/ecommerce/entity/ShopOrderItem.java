package com.clubsphere.ecommerce.entity;

import com.clubsphere.shop.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * ShopOrderItem — Represents an individual product line item in a shop order.
 *
 * Maps directly to table 'shop_order_items'.
 */
@Entity
@Table(name = "shop_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"order", "product"})
@EqualsAndHashCode(exclude = {"order", "product"})
public class ShopOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private ShopOrder order;

    @Column(name = "order_id", insertable = false, updatable = false)
    private Long orderId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    @PrePersist
    @PreUpdate
    protected void syncState() {
        if (order != null && order.getId() != null) {
            orderId = order.getId();
        }
        if (discountAmount == null) {
            discountAmount = BigDecimal.ZERO;
        }
        if (lineTotal == null && unitPrice != null && quantity != null) {
            lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity)).subtract(discountAmount);
        }
    }
}
