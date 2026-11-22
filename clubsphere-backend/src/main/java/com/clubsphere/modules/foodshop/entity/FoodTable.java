package com.clubsphere.modules.foodshop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "food_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "table_number", nullable = false, unique = true, length = 20)
    private String tableNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 4;

    @Column(length = 50)
    @Builder.Default
    private String section = "MAIN_CAFE"; // MAIN_CAFE, PATIO, LOUNGE, BALCONY

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, OCCUPIED, RESERVED, CLEANING, OUT_OF_SERVICE

    @Column(name = "current_order_id")
    private Long currentOrderId;

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
