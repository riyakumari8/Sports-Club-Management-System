package com.clubsphere.repository;

import com.clubsphere.model.SocialPlaySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SocialPlaySessionRepository extends JpaRepository<SocialPlaySession, Long> {

    List<SocialPlaySession> findBySessionDateGreaterThanEqualOrderBySessionDateAscStartTimeAsc(LocalDate fromDate);

    @Query("SELECT s FROM SocialPlaySession s WHERE s.court.courtId = :courtId " +
           "AND s.sessionDate = :sessionDate " +
           "AND s.sessionStatus != 'CANCELLED' " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    List<SocialPlaySession> findOverlappingSessions(@Param("courtId") Long courtId,
                                                   @Param("sessionDate") LocalDate sessionDate,
                                                   @Param("startTime") LocalTime startTime,
                                                   @Param("endTime") LocalTime endTime);
}
