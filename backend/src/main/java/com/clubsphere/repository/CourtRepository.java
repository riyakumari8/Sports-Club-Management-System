package com.clubsphere.repository;

import com.clubsphere.model.Court;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findByIsActiveTrue();

    List<Court> findBySportTypeIgnoreCaseAndIsActiveTrue(String sportType);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Court c WHERE c.courtId = :courtId")
    Optional<Court> findByIdForUpdate(@Param("courtId") Long courtId);

    @Query("SELECT c FROM Court c WHERE (CAST(:sportType AS String) IS NULL OR LOWER(c.sportType) = LOWER(CAST(:sportType AS String))) " +
           "AND (CAST(:courtStatus AS String) IS NULL OR LOWER(c.courtStatus) = LOWER(CAST(:courtStatus AS String))) " +
           "AND (CAST(:search AS String) IS NULL OR LOWER(c.courtName) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')) OR LOWER(c.location) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')))")
    List<Court> searchCourts(@Param("sportType") String sportType,
                             @Param("courtStatus") String courtStatus,
                             @Param("search") String search);
}
