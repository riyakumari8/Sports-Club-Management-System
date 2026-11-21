package com.clubsphere.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_reference", nullable = false, unique = true, length = 60)
    private String expenseReference;

    @Column(nullable = false, length = 50)
    private String category; // STAFF_SALARY, EQUIPMENT_PURCHASE, COURT_MAINTENANCE, UTILITIES_ELECTRICITY, SHOP_INVENTORY, EVENT_EXPENSE, OTHER

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "expense_date", nullable = false)
    @Builder.Default
    private LocalDate expenseDate = LocalDate.now();

    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    private String paymentMethod = "BANK_TRANSFER"; // BANK_TRANSFER, UPI, CARD, CASH

    @Column(name = "vendor_name", length = 150)
    private String vendorName;

    @Column(name = "receipt_url", length = 255)
    private String receiptUrl;

    @Column(name = "recorded_by_user_id")
    private Long recordedByUserId;

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
