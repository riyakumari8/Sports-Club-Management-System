package com.clubsphere.ecommerce.entity;

import com.clubsphere.ecommerce.enums.OrderStatus;
import com.clubsphere.ecommerce.enums.OrderType;
import com.clubsphere.ecommerce.enums.PaymentMethod;
import com.clubsphere.ecommerce.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ShopOrder — Represents an e-commerce merchandise order placed by a sports club member/customer.
 *
 * Maps directly to table 'shop_orders'.
 */
@Entity
@Table(name = "shop_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "items")
@EqualsAndHashCode(exclude = "items")
public class ShopOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 30)
    private String orderNumber;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "order_type", nullable = false, length = 20)
    private String orderType;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "payment_method", length = 30)
    private String paymentMethod;

    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private String paymentStatus = "PENDING";

    @Column(name = "order_status", nullable = false, length = 30)
    @Builder.Default
    private String orderStatus = "PENDING";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopOrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (orderStatus == null || orderStatus.isBlank()) {
            orderStatus = "PENDING";
        }
        if (paymentStatus == null || paymentStatus.isBlank()) {
            paymentStatus = "PENDING";
        }
        if (subtotal == null) {
            subtotal = BigDecimal.ZERO;
        }
        if (discountAmount == null) {
            discountAmount = BigDecimal.ZERO;
        }
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addItem(ShopOrderItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(ShopOrderItem item) {
        if (items != null) {
            items.remove(item);
            item.setOrder(null);
        }
    }

    public void setOrderType(OrderType type) {
        this.orderType = type != null ? type.name() : null;
    }

    public void setOrderType(String type) {
        this.orderType = type;
    }

    public void setPaymentMethod(PaymentMethod method) {
        this.paymentMethod = method != null ? method.name() : null;
    }

    public void setPaymentMethod(String method) {
        this.paymentMethod = method;
    }

    public void setPaymentStatus(PaymentStatus status) {
        this.paymentStatus = status != null ? status.name() : null;
    }

    public void setPaymentStatus(String status) {
        this.paymentStatus = status;
    }

    public void setOrderStatus(OrderStatus status) {
        this.orderStatus = status != null ? status.name() : null;
    }

    public void setOrderStatus(String status) {
        this.orderStatus = status;
    }
}
