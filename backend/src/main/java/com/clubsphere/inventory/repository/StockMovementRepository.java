package com.clubsphere.inventory.repository;

import com.clubsphere.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * StockMovementRepository — Spring Data JPA repository for stock movement audit logs.
 */
@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<StockMovement> findAllByOrderByCreatedAtDesc();
}
