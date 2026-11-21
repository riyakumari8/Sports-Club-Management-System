package com.clubsphere.ecommerce.repository;

import com.clubsphere.ecommerce.entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Long> {
    List<ShopOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<ShopOrder> findByOrderStatus(String orderStatus);
    Optional<ShopOrder> findByOrderNumber(String orderNumber);
    List<ShopOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<ShopOrder> findAllByOrderByCreatedAtDesc();
}
