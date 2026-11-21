package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * CafeteriaOrderItemRepository — Data access operations for line items in cafe orders.
 */
@Repository
public interface CafeteriaOrderItemRepository extends JpaRepository<CafeteriaOrderItem, Long> {

    /**
     * Finds all line items belonging to a specific order.
     *
     * @param orderId Order ID
     * @return List of line items
     */
    List<CafeteriaOrderItem> findByOrderId(Long orderId);
}
