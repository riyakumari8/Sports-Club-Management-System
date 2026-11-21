package com.clubsphere.ecommerce.repository;

import com.clubsphere.ecommerce.entity.CounterSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CounterSaleRepository extends JpaRepository<CounterSale, Long> {
    Optional<CounterSale> findByReceiptNumber(String receiptNumber);
    List<CounterSale> findBySaleTimeBetween(LocalDateTime start, LocalDateTime end);
    List<CounterSale> findAllByOrderBySaleTimeDesc();
}
