package com.clubsphere.cafe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * CafeteriaTab — Represents an open running tab tied to a cafeteria table for continuous ordering.
 */
@Entity
@Table(name = "cafeteria_tabs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaTab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private CafeteriaTable table;

    @Column(name = "table_id", insertable = false, updatable = false)
    private Long tableId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "running_total", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal runningTotal = BigDecimal.ZERO;

    @Column(name = "is_open", nullable = false)
    @Builder.Default
    private Boolean isOpen = true;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @PrePersist
    protected void onCreate() {
        if (openedAt == null) {
            openedAt = LocalDateTime.now();
        }
        if (runningTotal == null) {
            runningTotal = BigDecimal.ZERO;
        }
        if (isOpen == null) {
            isOpen = true;
        }
        if (table != null && table.getId() != null) {
            tableId = table.getId();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (table != null && table.getId() != null) {
            tableId = table.getId();
        }
    }
}
