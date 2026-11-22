package com.clubsphere.modules.sportsshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sports_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SportsCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 50)
    private String icon;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
