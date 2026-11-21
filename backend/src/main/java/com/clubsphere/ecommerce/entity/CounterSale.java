package com.clubsphere.ecommerce.entity;

import com.clubsphere.ecommerce.enums.PaymentMethod;
import com.clubsphere.ecommerce.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * CounterSale — Represents an in-person, over-the-counter POS sale at the Sports Club pro-shop.
 *
 * Maps directly to table 'counter_sales'.
 */
@Entity
@Table(name = "counter_sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "items")
@EqualsAndHashCode(exclude = "items")
public class CounterSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 30)
    private String receiptNumber;

    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "payment_method", length = 30)
    private String paymentMethod;

    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private String paymentStatus = "COMPLETED";

    @Column(name = "sale_time", nullable = false)
    private LocalDateTime saleTime;

    @OneToMany(mappedBy = "counterSale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CounterSaleItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (saleTime == null) {
            saleTime = LocalDateTime.now();
        }
        if (paymentStatus == null || paymentStatus.isBlank()) {
            paymentStatus = "COMPLETED";
        }
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
    }

    public void addItem(CounterSaleItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setCounterSale(this);
    }

    public void removeItem(CounterSaleItem item) {
        if (items != null) {
            items.remove(item);
            item.setCounterSale(null);
        }
    }

    public void setPaymentMethod(PaymentMethod method) {
        this.paymentMethod = method != null ? method.name() : null;
    }

    public void setPaymentStatus(PaymentStatus status) {
        this.paymentStatus = status != null ? status.name() : null;
    }
}
