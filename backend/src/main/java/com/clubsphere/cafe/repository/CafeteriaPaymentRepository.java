package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.CafeteriaPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * CafeteriaPaymentRepository — Data access operations for cafe payments.
 */
@Repository
public interface CafeteriaPaymentRepository extends JpaRepository<CafeteriaPayment, Long> {

    /**
     * Finds all payment records associated with a specific order.
     *
     * @param orderId Order ID
     * @return List of payment records
     */
    List<CafeteriaPayment> findByOrderId(Long orderId);
}
