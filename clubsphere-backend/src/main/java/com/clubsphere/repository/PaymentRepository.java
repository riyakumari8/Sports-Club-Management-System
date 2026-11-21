package com.clubsphere.repository;

import com.clubsphere.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(String paymentReference);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findAllByOrderByPaymentDateDesc();

    List<Payment> findByUserIdOrderByPaymentDateDesc(Long userId);

    List<Payment> findByPaymentDateBetweenOrderByPaymentDateDesc(OffsetDateTime start, OffsetDateTime end);

    @Query("SELECT p FROM Payment p WHERE " +
           "(:status IS NULL OR p.paymentStatus = :status) AND " +
           "(:module IS NULL OR p.sourceModule = :module) AND " +
           "(:method IS NULL OR p.paymentMethod = :method) AND " +
           "(:start IS NULL OR p.paymentDate >= :start) AND " +
           "(:end IS NULL OR p.paymentDate <= :end) " +
           "ORDER BY p.paymentDate DESC")
    List<Payment> filterPayments(
            @Param("status") String status,
            @Param("module") String module,
            @Param("method") String method,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end
    );

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' AND p.paymentDate >= :start AND p.paymentDate <= :end")
    BigDecimal sumRevenueBetween(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT COALESCE(SUM(p.refundAmount), 0) FROM Payment p WHERE p.paymentStatus IN ('REFUNDED', 'PARTIALLY_REFUNDED')")
    BigDecimal sumTotalRefunds();

    @Query("SELECT COALESCE(SUM(p.refundAmount), 0) FROM Payment p WHERE p.paymentStatus IN ('REFUNDED', 'PARTIALLY_REFUNDED') AND p.paymentDate >= :start AND p.paymentDate <= :end")
    BigDecimal sumRefundsBetween(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PENDING'")
    BigDecimal sumPendingAmount();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PENDING' AND p.paymentDate >= :start AND p.paymentDate <= :end")
    BigDecimal sumPendingAmountBetween(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    long countByPaymentStatus(String paymentStatus);
}
