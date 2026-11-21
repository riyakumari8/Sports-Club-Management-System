package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * CafeteriaOrderRepository — Data access operations for cafeteria orders.
 */
@Repository
public interface CafeteriaOrderRepository extends JpaRepository<CafeteriaOrder, Long> {

    /**
     * Finds orders matching a specific status (e.g. PENDING, PREPARING, etc.).
     *
     * @param orderStatus Status string
     * @return List of matching orders
     */
    List<CafeteriaOrder> findByOrderStatus(String orderStatus);

    /**
     * Finds all orders placed at a specific table.
     *
     * @param tableId Table ID
     * @return List of orders for the table
     */
    List<CafeteriaOrder> findByTableId(Long tableId);

    /**
     * Finds all orders attached to a specific running tab.
     *
     * @param tabId Tab ID
     * @return List of orders under that tab
     */
    List<CafeteriaOrder> findByTabId(Long tabId);

    /**
     * Finds orders created within a given date/time range (used for daily sales analytics).
     *
     * @param start Range start timestamp
     * @param end   Range end timestamp
     * @return List of orders within the range
     */
    List<CafeteriaOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Finds an order by its unique business order number.
     *
     * @param orderNumber Generated order number (e.g., CAFE-...)
     * @return Optional CafeteriaOrder
     */
    Optional<CafeteriaOrder> findByOrderNumber(String orderNumber);

    /**
     * Finds orders matching any status in the provided collection (e.g. kitchen active statuses).
     *
     * @param statuses Collection of order status strings
     * @return List of matching orders
     */
    List<CafeteriaOrder> findByOrderStatusIn(Collection<String> statuses);

    /**
     * Finds active orders for a table where status is not in the excluded list (e.g. COMPLETED, CANCELLED).
     *
     * @param tableId  Table ID
     * @param statuses Excluded status list
     * @return List of active orders remaining on the table
     */
    List<CafeteriaOrder> findByTableIdAndOrderStatusNotIn(Long tableId, Collection<String> statuses);
}
