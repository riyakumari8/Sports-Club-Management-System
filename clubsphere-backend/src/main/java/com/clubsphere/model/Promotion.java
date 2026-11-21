package com.clubsphere.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 50)
    private String category; // MEMBERSHIP, STUDENT, SPORTS_SHOP, FOOD_SHOP, TOURNAMENT

    @Column(name = "discount_text", nullable = false, length = 100)
    private String discountText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, EXPIRED

    @Column(columnDefinition = "TEXT")
    private String terms;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
