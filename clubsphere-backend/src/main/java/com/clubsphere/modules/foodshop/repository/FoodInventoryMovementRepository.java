package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodInventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodInventoryMovementRepository extends JpaRepository<FoodInventoryMovement, Long> {
    List<FoodInventoryMovement> findTop30ByOrderByCreatedAtDesc();
    List<FoodInventoryMovement> findByIngredientIdOrderByCreatedAtDesc(Long ingredientId);
}
