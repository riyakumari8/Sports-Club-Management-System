package com.clubsphere.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Inventory Entity — Maps to the 'inventory' table.
 * 
 * Note on stock_status:
 * Managed by PostgreSQL trigger 'trg_update_inventory_status' when quantity_in_stock changes.
 */
@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false, unique = true)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private com.clubsphere.shop.entity.Product product;

    @Column(name = "quantity_in_stock", nullable = false)
    @Builder.Default
    private Integer quantityInStock = 0;

    @Column(name = "minimum_stock_threshold", nullable = false)
    @Builder.Default
    private Integer minimumStockThreshold = 5;

    @Column(name = "stock_status", nullable = false, length = 20)
    @Builder.Default
    private String stockStatus = "OUT_OF_STOCK";

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        if (lastUpdated == null) {
            lastUpdated = LocalDateTime.now();
        }
        if (quantityInStock == null) {
            quantityInStock = 0;
        }
        if (minimumStockThreshold == null) {
            minimumStockThreshold = 5;
        }
        updateStatusInMemory();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
        updateStatusInMemory();
    }

    private void updateStatusInMemory() {
        if (quantityInStock <= 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (quantityInStock <= minimumStockThreshold) {
            stockStatus = "LOW_STOCK";
        } else {
            stockStatus = "IN_STOCK";
        }
    }
}
