package com.clubsphere.cafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * CafeteriaOrderItem — Represents a single dish/beverage item line in a cafeteria order.
 */
@Entity
@Table(name = "cafeteria_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"order", "menuItem"})
@EqualsAndHashCode(exclude = {"order", "menuItem"})
public class CafeteriaOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private CafeteriaOrder order;

    @Column(name = "order_id", insertable = false, updatable = false)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(name = "menu_item_id", insertable = false, updatable = false)
    private Long menuItemId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    @Column(name = "special_note", columnDefinition = "TEXT")
    private String specialNote;

    @PrePersist
    @PreUpdate
    protected void syncForeignKeys() {
        if (order != null && order.getId() != null) {
            orderId = order.getId();
        }
        if (menuItem != null && menuItem.getId() != null) {
            menuItemId = menuItem.getId();
        }
    }
}
