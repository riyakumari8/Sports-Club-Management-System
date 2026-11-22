package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsCategoryRepository extends JpaRepository<SportsCategory, Integer> {
    Optional<SportsCategory> findByCode(String code);
    List<SportsCategory> findByIsActiveTrue();
}
