package com.clubsphere.modules.sportsshop.entity;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sports_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SportsOrder {

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
    private String paymentMethod; // CASH, CARD, UPI, ONLINE

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "COMPLETED"; // PENDING, COMPLETED, REFUNDED

    @Column(name = "order_status", nullable = false, length = 50)
    @Builder.Default
    private String orderStatus = "NEW"; // NEW, ACCEPTED, PACKING, READY_FOR_PICKUP, DISPATCHED, COMPLETED, REJECTED, CANCELLED

    @Column(name = "fulfilment_type", nullable = false, length = 50)
    @Builder.Default
    private String fulfilmentType = "PICKUP"; // PICKUP, COUNTER, DELIVERY

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
    private Employee assignedStaff;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SportsOrderItem> items = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
