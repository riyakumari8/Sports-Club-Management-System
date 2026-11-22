package com.clubsphere.modules.foodshop.repository;

import com.clubsphere.modules.foodshop.entity.FoodBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodBillRepository extends JpaRepository<FoodBill, Long> {
    Optional<FoodBill> findByBillNumber(String billNumber);
    Optional<FoodBill> findByOrderId(Long orderId);
    List<FoodBill> findAllByOrderByCreatedAtDesc();
}
