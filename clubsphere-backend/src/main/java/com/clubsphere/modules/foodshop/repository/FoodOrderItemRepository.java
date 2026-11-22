package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodOrderItemRepository extends JpaRepository<FoodOrderItem, Long> {
    List<FoodOrderItem> findByOrderId(Long orderId);
}
