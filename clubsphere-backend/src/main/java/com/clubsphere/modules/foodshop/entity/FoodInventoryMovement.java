package com.clubsphere.modules.foodshop.entity;

import com.clubsphere.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "food_inventory_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodInventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private FoodIngredient ingredient;

    @Column(name = "movement_type", nullable = false, length = 50)
    private String movementType; // STOCK_RECEIVED, USAGE, WASTAGE, DAMAGED, EXPIRED, CORRECTION

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "stock_before", nullable = false, precision = 10, scale = 2)
    private BigDecimal stockBefore;

    @Column(name = "stock_after", nullable = false, precision = 10, scale = 2)
    private BigDecimal stockAfter;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
