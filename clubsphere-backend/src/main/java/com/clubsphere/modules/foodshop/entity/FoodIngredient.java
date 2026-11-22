package com.clubsphere.modules.foodshop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "food_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String unit; // KG, LITERS, PIECES, GRAMS, PACKETS

    @Column(name = "current_stock", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "reorder_threshold", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal reorderThreshold = BigDecimal.valueOf(5.0);

    @Column(name = "cost_per_unit", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal costPerUnit = BigDecimal.ZERO;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
