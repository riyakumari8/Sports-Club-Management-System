package com.clubsphere.ecommerce.repository;

import com.clubsphere.ecommerce.entity.ShopOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopOrderStatusHistoryRepository extends JpaRepository<ShopOrderStatusHistory, Long> {
    List<ShopOrderStatusHistory> findByOrderIdOrderByChangedAtDesc(Long orderId);
}
