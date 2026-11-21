package com.clubsphere.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "shop_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_type", nullable = false, length = 50)
    private String shopType; // SPORTS_ACCESSORY, FOOD_BEVERAGE

    @Column(nullable = false, length = 50)
    private String category; // RACKETS, BALLS, SHOES, ACCESSORIES, APPAREL, FOOD, DRINKS, SNACKS

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "in_stock", nullable = false)
    @Builder.Default
    private Boolean inStock = true;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "pickup_info")
    private String pickupInfo;

    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
