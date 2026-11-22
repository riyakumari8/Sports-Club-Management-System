package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsProductVariantRepository extends JpaRepository<SportsProductVariant, Long> {
    Optional<SportsProductVariant> findBySku(String sku);
    List<SportsProductVariant> findByProductId(Long productId);
}
