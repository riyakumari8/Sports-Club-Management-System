package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodMenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodMenuItemRepository extends JpaRepository<FoodMenuItem, Long> {
    List<FoodMenuItem> findByIsAvailableTrue();

    @Query("SELECT m FROM FoodMenuItem m WHERE " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:isVeg IS NULL OR m.isVegetarian = :isVeg) AND " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<FoodMenuItem> searchMenuItems(
            @Param("categoryId") Integer categoryId,
            @Param("isVeg") Boolean isVeg,
            @Param("search") String search
    );

    long countByIsAvailableTrue();
    long countByIsAvailableFalse();
}
