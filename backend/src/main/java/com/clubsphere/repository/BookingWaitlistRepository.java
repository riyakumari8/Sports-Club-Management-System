package com.clubsphere.repository;

import com.clubsphere.model.BookingWaitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingWaitlistRepository extends JpaRepository<BookingWaitlist, Long> {

    List<BookingWaitlist> findByCourtCourtIdAndDesiredDateAndDesiredStartTimeAndStatusOrderByQueuePositionAsc(
            Long courtId, LocalDate desiredDate, LocalTime desiredStartTime, String status);

    List<BookingWaitlist> findByMemberIdOrderByCreatedAtDesc(Long memberId);
}
