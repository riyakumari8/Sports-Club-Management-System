package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * CafeteriaOrderStatusHistoryRepository — Data access operations for order status audit history.
 */
@Repository
public interface CafeteriaOrderStatusHistoryRepository extends JpaRepository<CafeteriaOrderStatusHistory, Long> {

    /**
     * Retrieves status change history for an order in reverse chronological order.
     *
     * @param orderId Order ID
     * @return List of status history entries
     */
    List<CafeteriaOrderStatusHistory> findByOrderIdOrderByChangedAtDesc(Long orderId);
}
