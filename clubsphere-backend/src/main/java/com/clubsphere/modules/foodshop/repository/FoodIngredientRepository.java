package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodIngredientRepository extends JpaRepository<FoodIngredient, Long> {
    List<FoodIngredient> findByIsAvailableTrue();

    @Query("SELECT i FROM FoodIngredient i WHERE i.currentStock <= i.reorderThreshold")
    List<FoodIngredient> findLowStockIngredients();

    @Query("SELECT COUNT(i) FROM FoodIngredient i WHERE i.currentStock <= i.reorderThreshold")
    long countLowStockIngredients();
}
