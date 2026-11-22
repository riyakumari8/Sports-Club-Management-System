package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsInventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportsInventoryMovementRepository extends JpaRepository<SportsInventoryMovement, Long> {
    List<SportsInventoryMovement> findTop30ByOrderByCreatedAtDesc();
    List<SportsInventoryMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
}
