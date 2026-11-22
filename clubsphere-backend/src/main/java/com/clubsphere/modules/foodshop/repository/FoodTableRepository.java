package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodTableRepository extends JpaRepository<FoodTable, Integer> {
    Optional<FoodTable> findByTableNumber(String tableNumber);
    List<FoodTable> findAllByOrderByTableNumberAsc();
    List<FoodTable> findByStatus(String status);
    long countByStatus(String status);
}
