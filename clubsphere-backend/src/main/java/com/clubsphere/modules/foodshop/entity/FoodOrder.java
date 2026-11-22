package com.clubsphere.modules.foodshop.entity;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "customer_email", length = 150)
    private String customerEmail;

    @Column(name = "customer_phone", length = 50)
    private String customerPhone;

    @Column(name = "order_type", nullable = false, length = 50)
    @Builder.Default
    private String orderType = "COUNTER"; // COUNTER, TABLE, TAKEAWAY, ONLINE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private FoodTable table;

    @Column(name = "table_number", length = 20)
    private String tableNumber;

    @Column(name = "membership_tier", length = 30)
    @Builder.Default
    private String membershipTier = "NON_MEMBER"; // GOLD, SILVER, JUNIOR, NON_MEMBER

    @Column(name = "membership_discount_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal membershipDiscountPercent = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "payment_method", nullable = false, length = 50)
    @Builder.Default
    private String paymentMethod = "CASH"; // CASH, CARD, UPI, ONLINE

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "COMPLETED"; // PENDING, COMPLETED, REFUNDED

    @Column(name = "order_status", nullable = false, length = 50)
    @Builder.Default
    private String orderStatus = "PENDING"; // PENDING, ACCEPTED, PREPARING, READY, COMPLETED, REJECTED, CANCELLED

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
    private Employee assignedStaff;

    @Column(name = "accepted_at")
    private OffsetDateTime acceptedAt;

    @Column(name = "preparing_at")
    private OffsetDateTime preparingAt;

    @Column(name = "ready_at")
    private OffsetDateTime readyAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FoodOrderItem> items = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
