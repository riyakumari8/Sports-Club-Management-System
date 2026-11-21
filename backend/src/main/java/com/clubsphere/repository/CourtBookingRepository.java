package com.clubsphere.repository;

import com.clubsphere.model.CourtBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourtBookingRepository extends JpaRepository<CourtBooking, Long> {

    Optional<CourtBooking> findByBookingReference(String bookingReference);

    Optional<CourtBooking> findByQrCodeHash(String qrCodeHash);

    List<CourtBooking> findByMemberIdOrderByBookingDateDescStartTimeDesc(Long memberId);

    List<CourtBooking> findByCourtCourtIdAndBookingDateAndBookingStatusIn(Long courtId, LocalDate bookingDate, List<String> statuses);

    // Overlap query for bookings on the same court
    @Query("SELECT cb FROM CourtBooking cb WHERE cb.court.courtId = :courtId " +
           "AND cb.bookingDate = :bookingDate " +
           "AND cb.bookingStatus IN ('CONFIRMED', 'PENDING') " +
           "AND cb.startTime < :endTime AND cb.endTime > :startTime " +
           "AND (CAST(:excludeBookingId AS Long) IS NULL OR cb.bookingId != :excludeBookingId)")
    List<CourtBooking> findOverlappingBookings(@Param("courtId") Long courtId,
                                              @Param("bookingDate") LocalDate bookingDate,
                                              @Param("startTime") LocalTime startTime,
                                              @Param("endTime") LocalTime endTime,
                                              @Param("excludeBookingId") Long excludeBookingId);

    // Count daily regular sessions per member (Rule: max 2 regular sessions per day)
    @Query("SELECT COUNT(cb) FROM CourtBooking cb WHERE cb.memberId = :memberId " +
           "AND cb.bookingDate = :bookingDate " +
           "AND cb.bookingStatus IN ('CONFIRMED', 'PENDING') " +
           "AND (CAST(:excludeBookingId AS Long) IS NULL OR cb.bookingId != :excludeBookingId)")
    long countDailyBookingsForMember(@Param("memberId") Long memberId,
                                    @Param("bookingDate") LocalDate bookingDate,
                                    @Param("excludeBookingId") Long excludeBookingId);

    // All bookings filtered for admin overview
    @Query("SELECT cb FROM CourtBooking cb WHERE (CAST(:courtId AS Long) IS NULL OR cb.court.courtId = :courtId) " +
           "AND (CAST(:bookingDate AS LocalDate) IS NULL OR cb.bookingDate = :bookingDate) " +
           "AND (CAST(:status AS String) IS NULL OR cb.bookingStatus = :status) " +
           "ORDER BY cb.bookingDate DESC, cb.startTime DESC")
    List<CourtBooking> findBookingsFiltered(@Param("courtId") Long courtId,
                                           @Param("bookingDate") LocalDate bookingDate,
                                           @Param("status") String status);
}
