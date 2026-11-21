package com.clubsphere.ecommerce.entity;

import com.clubsphere.ecommerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ShopOrderStatusHistory — Audit log tracking lifecycle state transitions of a shop order.
 *
 * Maps directly to table 'shop_order_status_history'.
 */
@Entity
@Table(name = "shop_order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "status", nullable = false, length = 30)
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

    public void setStatus(OrderStatus orderStatus) {
        this.status = orderStatus != null ? orderStatus.name() : null;
    }
}
