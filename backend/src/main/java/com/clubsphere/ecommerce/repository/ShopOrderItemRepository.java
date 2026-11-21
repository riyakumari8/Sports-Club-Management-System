package com.clubsphere.ecommerce.repository;

import com.clubsphere.ecommerce.entity.ShopOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopOrderItemRepository extends JpaRepository<ShopOrderItem, Long> {
    List<ShopOrderItem> findByOrderId(Long orderId);
}
