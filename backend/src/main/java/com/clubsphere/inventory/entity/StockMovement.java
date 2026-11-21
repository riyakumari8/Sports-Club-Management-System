package com.clubsphere.inventory.entity;

import com.clubsphere.shop.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * StockMovement — Entity representing audit logs of all inventory movements.
 * Maps to PostgreSQL 'stock_movements' table.
 */
@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Column(name = "recorded_by")
    private Long recordedBy;

    @Column(name = "movement_type", nullable = false, length = 30)
    private String movementType;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "previous_stock", nullable = false)
    private int previousStock;

    @Column(name = "updated_stock", nullable = false)
    private int updatedStock;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
