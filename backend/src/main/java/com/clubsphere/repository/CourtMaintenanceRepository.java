package com.clubsphere.repository;

import com.clubsphere.model.CourtMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface CourtMaintenanceRepository extends JpaRepository<CourtMaintenance, Long> {

    List<CourtMaintenance> findByCourtCourtIdOrderByStartTimeDesc(Long courtId);

    @Query("SELECT cm FROM CourtMaintenance cm WHERE cm.court.courtId = :courtId " +
           "AND cm.startTime < :endTime AND cm.endTime > :startTime")
    List<CourtMaintenance> findOverlappingMaintenance(@Param("courtId") Long courtId,
                                                      @Param("startTime") OffsetDateTime startTime,
                                                      @Param("endTime") OffsetDateTime endTime);
}
