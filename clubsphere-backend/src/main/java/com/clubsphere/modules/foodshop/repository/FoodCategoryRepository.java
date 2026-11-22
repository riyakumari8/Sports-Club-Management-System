package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {
    Optional<FoodCategory> findByCode(String code);
    List<FoodCategory> findByIsActiveTrueOrderByDisplayOrderAsc();
}
