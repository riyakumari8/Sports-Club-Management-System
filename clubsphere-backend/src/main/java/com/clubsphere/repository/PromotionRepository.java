package com.clubsphere.repository;

import com.clubsphere.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT p FROM Promotion p WHERE " +
           "(CAST(:category AS String) IS NULL OR LOWER(p.category) = LOWER(CAST(:category AS String))) AND " +
           "(CAST(:status AS String) IS NULL OR LOWER(p.status) = LOWER(CAST(:status AS String))) " +
           "ORDER BY p.validUntil ASC")
    List<Promotion> searchPromotions(
            @Param("category") String category,
            @Param("status") String status
    );
}
