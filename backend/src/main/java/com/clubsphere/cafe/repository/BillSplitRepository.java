package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.BillSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BillSplitRepository — Data access operations for split bill payments.
 */
@Repository
public interface BillSplitRepository extends JpaRepository<BillSplit, Long> {

    /**
     * Finds all bill split records for a specific order.
     *
     * @param orderId Order ID
     * @return List of bill split portions
     */
    List<BillSplit> findByOrderId(Long orderId);
}
