package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsReturnRepository extends JpaRepository<SportsReturn, Long> {
    Optional<SportsReturn> findByReturnNumber(String returnNumber);
    List<SportsReturn> findAllByOrderByCreatedAtDesc();
}
