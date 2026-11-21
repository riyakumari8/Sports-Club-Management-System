package com.clubsphere.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_reference", nullable = false, unique = true, length = 60)
    private String paymentReference;

    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "source_module", nullable = false, length = 40)
    private String sourceModule; // MEMBERSHIP, MEMBERSHIP_RENEWAL, MEMBERSHIP_UPGRADE, COURT_BOOKING, SPORTS_SHOP, FOOD_BEVERAGE, OTHER

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod; // UPI, CASH, CARD, ONLINE, BANK_TRANSFER

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "COMPLETED"; // COMPLETED, PENDING, FAILED, REFUNDED, PARTIALLY_REFUNDED

    @Column(name = "refund_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Column(name = "received_by_staff_id")
    private Long receivedByStaffId;

    @Column(name = "payer_name", length = 120)
    private String payerName;

    @Column(name = "payer_email", length = 120)
    private String payerEmail;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_demo", nullable = false)
    @Builder.Default
    private Boolean isDemo = true;

    @Column(name = "payment_date")
    @Builder.Default
    private OffsetDateTime paymentDate = OffsetDateTime.now();

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
