package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    Optional<FoodOrder> findByOrderNumber(String orderNumber);
    List<FoodOrder> findTop50ByOrderByCreatedAtDesc();
    List<FoodOrder> findByOrderStatusOrderByCreatedAtDesc(String orderStatus);

    @Query("SELECT o FROM FoodOrder o WHERE " +
           "(:status IS NULL OR o.orderStatus = :status) AND " +
           "(:search IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(o.tableNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY o.createdAt DESC")
    List<FoodOrder> searchOrders(@Param("status") String status, @Param("search") String search);

    long countByOrderStatus(String orderStatus);

    @Query("SELECT COUNT(o) FROM FoodOrder o WHERE o.createdAt >= :since")
    long countOrdersSince(@Param("since") OffsetDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM FoodOrder o WHERE o.paymentStatus = 'COMPLETED' AND o.createdAt >= :since")
    BigDecimal sumTotalSalesSince(@Param("since") OffsetDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM FoodOrder o WHERE o.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalSalesAllTime();
}
