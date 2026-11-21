package com.clubsphere.modules.membership.entity;

import com.clubsphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "membership_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "plan_code", nullable = false, unique = true, length = 30)
    private String planCode; // e.g. GOLD-YR, SILVER-MN, JUNIOR-YR

    @Column(nullable = false, length = 100)
    private String name; // Gold Membership, Silver Membership, Junior Membership

    @Column(nullable = false, length = 30)
    private String category; // GOLD, SILVER, JUNIOR

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Configurable by admin

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays; // e.g. 365, 180, 30

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge; // e.g. 17 for Junior

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
