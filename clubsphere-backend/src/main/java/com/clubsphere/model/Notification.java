package com.clubsphere.model;

import com.clubsphere.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @Column(name = "recipient_role", length = 30)
    private String recipientRole; // ROLE_ADMIN, ROLE_STAFF, ROLE_MEMBER

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(length = 50)
    @Builder.Default
    private String category = "SYSTEM"; // MEMBERSHIP, BOOKING, FINANCE, INVENTORY, STAFF_DUTY, ENQUIRY, TRIAL, SYSTEM

    @Column(length = 20)
    @Builder.Default
    private String severity = "INFO"; // CRITICAL, HIGH, MEDIUM, LOW, INFO

    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "action_url", length = 255)
    private String actionUrl;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
