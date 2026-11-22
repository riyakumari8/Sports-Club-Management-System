package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsOrderRepository extends JpaRepository<SportsOrder, Long> {
    Optional<SportsOrder> findByOrderNumber(String orderNumber);
    List<SportsOrder> findTop50ByOrderByCreatedAtDesc();
    List<SportsOrder> findByOrderStatusOrderByCreatedAtDesc(String orderStatus);

    @Query("SELECT o FROM SportsOrder o WHERE " +
           "(:status IS NULL OR o.orderStatus = :status) AND " +
           "(:search IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerPhone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY o.createdAt DESC")
    List<SportsOrder> searchOrders(@Param("status") String status, @Param("search") String search);

    long countByOrderStatus(String orderStatus);

    @Query("SELECT COUNT(o) FROM SportsOrder o WHERE o.createdAt >= :since")
    long countOrdersSince(@Param("since") OffsetDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM SportsOrder o WHERE o.paymentStatus = 'COMPLETED' AND o.createdAt >= :since")
    BigDecimal sumTotalSalesSince(@Param("since") OffsetDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM SportsOrder o WHERE o.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalSalesAllTime();
}
