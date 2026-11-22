package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportsOrderItemRepository extends JpaRepository<SportsOrderItem, Long> {
    List<SportsOrderItem> findByOrderId(Long orderId);
}
