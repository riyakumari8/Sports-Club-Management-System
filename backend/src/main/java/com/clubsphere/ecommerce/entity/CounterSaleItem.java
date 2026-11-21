package com.clubsphere.ecommerce.entity;

import com.clubsphere.shop.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * CounterSaleItem — Represents an individual product line item in a physical counter sale.
 *
 * Maps directly to table 'counter_sale_items'.
 */
@Entity
@Table(name = "counter_sale_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"counterSale", "product"})
@EqualsAndHashCode(exclude = {"counterSale", "product"})
public class CounterSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_sale_id", nullable = false)
    @JsonIgnore
    private CounterSale counterSale;

    @Column(name = "counter_sale_id", insertable = false, updatable = false)
    private Long counterSaleId;

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
        if (counterSale != null && counterSale.getId() != null) {
            counterSaleId = counterSale.getId();
        }
        if (discountAmount == null) {
            discountAmount = BigDecimal.ZERO;
        }
        if (lineTotal == null && unitPrice != null && quantity != null) {
            lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity)).subtract(discountAmount);
        }
    }
}
