package com.clubsphere.cafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * CafeteriaOrder — Represents an order placed at the cafe or bar (dine-in or takeaway).
 */
@Entity
@Table(name = "cafeteria_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"items", "table", "tab"})
@EqualsAndHashCode(exclude = {"items", "table", "tab"})
public class CafeteriaOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 30)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private CafeteriaTable table;

    @Column(name = "table_id", insertable = false, updatable = false)
    private Long tableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tab_id")
    private CafeteriaTab tab;

    @Column(name = "tab_id", insertable = false, updatable = false)
    private Long tabId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "order_type", nullable = false, length = 20)
    private String orderType;

    @Column(name = "order_status", nullable = false, length = 20)
    @Builder.Default
    private String orderStatus = "PENDING";

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CafeteriaOrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (orderStatus == null || orderStatus.isBlank()) {
            orderStatus = "PENDING";
        }
        if (subtotal == null) subtotal = BigDecimal.ZERO;
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
        if (taxAmount == null) taxAmount = BigDecimal.ZERO;
        if (totalAmount == null) totalAmount = BigDecimal.ZERO;
        if (table != null && table.getId() != null) {
            tableId = table.getId();
        }
        if (tab != null && tab.getId() != null) {
            tabId = tab.getId();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (table != null && table.getId() != null) {
            tableId = table.getId();
        }
        if (tab != null && tab.getId() != null) {
            tabId = tab.getId();
        }
    }

    public void addItem(CafeteriaOrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(CafeteriaOrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
