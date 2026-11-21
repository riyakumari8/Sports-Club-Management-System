package com.clubsphere.ecommerce.repository;

import com.clubsphere.ecommerce.entity.CounterSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounterSaleItemRepository extends JpaRepository<CounterSaleItem, Long> {
    List<CounterSaleItem> findByCounterSaleId(Long counterSaleId);
}
