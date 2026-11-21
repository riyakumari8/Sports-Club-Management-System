package com.clubsphere.cafe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * CafeteriaOrderStatusHistory — Audit log tracking transitions of order statuses (e.g. PENDING -> PREPARING).
 */
@Entity
@Table(name = "cafeteria_order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeteriaOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "changed_by", length = 100)
    private String changedBy;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }
}
