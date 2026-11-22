package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsCounterSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsCounterSaleRepository extends JpaRepository<SportsCounterSale, Long> {
    Optional<SportsCounterSale> findBySaleNumber(String saleNumber);
    List<SportsCounterSale> findAllByOrderByCreatedAtDesc();
}
