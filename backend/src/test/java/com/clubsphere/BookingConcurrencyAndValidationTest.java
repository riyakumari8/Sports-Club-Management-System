package com.clubsphere;

import com.clubsphere.dto.BookingRequestDTO;
import com.clubsphere.dto.MaintenanceRequestDTO;
import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ConflictException;
import com.clubsphere.model.Court;
import com.clubsphere.model.CourtBooking;
import com.clubsphere.repository.CourtBookingRepository;
import com.clubsphere.repository.CourtRepository;
import com.clubsphere.service.BookingService;
import com.clubsphere.service.CourtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BookingConcurrencyAndValidationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CourtService courtService;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private CourtBookingRepository bookingRepository;

    private Court testCourt;
    private final LocalDate targetDate = LocalDate.now().plusDays(2); // In the future

    @BeforeEach
    void setUp() {
        testCourt = courtRepository.findAll().get(0);
    }

    @Test
    @DisplayName("Should successfully confirm a valid court booking with membership discount")
    void testSuccessfulBookingWithSilverDiscount() {
        BookingRequestDTO request = new BookingRequestDTO();
        request.setCourtId(testCourt.getCourtId());
        request.setMemberId(101L);
        request.setMemberTier("SILVER"); // 25% discount
        request.setBookingDate(targetDate);
        request.setStartTime(LocalTime.of(10, 0));

        CourtBooking booking = bookingService.createBooking(request);

        assertNotNull(booking.getBookingId());
        assertNotNull(booking.getBookingReference());
        assertEquals("CONFIRMED", booking.getBookingStatus());
        assertEquals(LocalTime.of(10, 0), booking.getStartTime());
        assertEquals(LocalTime.of(11, 0), booking.getEndTime());
        assertNotNull(booking.getQrCodeHash());

        // Base rate is standard rate, silver gets 25% off
        BigDecimal expectedFinal = testCourt.getStandardHourlyRate().multiply(new BigDecimal("0.75"));
        assertEquals(0, expectedFinal.compareTo(booking.getFinalAmount()));
    }

    @Test
    @DisplayName("Should strictly prevent overlapping regular booking on same court (e.g. 10:30 when 10:00-11:00 is booked)")
    void testOverlapPrevention() {
        // Book 10:00 - 11:00
        BookingRequestDTO first = new BookingRequestDTO();
        first.setCourtId(testCourt.getCourtId());
        first.setMemberId(102L);
        first.setMemberTier("GOLD");
        first.setBookingDate(targetDate);
        first.setStartTime(LocalTime.of(10, 0));
        bookingService.createBooking(first);

        // Attempt staggered overlap: 10:30 - 11:30 (Starts 30 mins after, overlaps by 30 mins)
        BookingRequestDTO overlapping = new BookingRequestDTO();
        overlapping.setCourtId(testCourt.getCourtId());
        overlapping.setMemberId(103L);
        overlapping.setBookingDate(targetDate);
        overlapping.setStartTime(LocalTime.of(10, 30));

        assertThrows(ConflictException.class, () -> {
            bookingService.createBooking(overlapping);
        }, "Should throw ConflictException when an overlapping booking is attempted on the same court");
    }

    @Test
    @DisplayName("Should enforce daily booking limit: max 2 regular sessions per member per day")
    void testDailyBookingLimit() {
        Long memberId = 205L;

        // Session 1: 08:00 - 09:00
        BookingRequestDTO b1 = new BookingRequestDTO();
        b1.setCourtId(testCourt.getCourtId());
        b1.setMemberId(memberId);
        b1.setBookingDate(targetDate);
        b1.setStartTime(LocalTime.of(8, 0));
        bookingService.createBooking(b1);

        // Session 2: 14:00 - 15:00
        BookingRequestDTO b2 = new BookingRequestDTO();
        b2.setCourtId(testCourt.getCourtId());
        b2.setMemberId(memberId);
        b2.setBookingDate(targetDate);
        b2.setStartTime(LocalTime.of(14, 0));
        bookingService.createBooking(b2);

        // Session 3 on same day: MUST be rejected
        BookingRequestDTO b3 = new BookingRequestDTO();
        b3.setCourtId(testCourt.getCourtId());
        b3.setMemberId(memberId);
        b3.setBookingDate(targetDate);
        b3.setStartTime(LocalTime.of(16, 0));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            bookingService.createBooking(b3);
        });
        assertTrue(ex.getMessage().contains("Daily limit reached"));
    }

    @Test
    @DisplayName("Should block bookings during scheduled court maintenance blackout")
    void testMaintenanceBlock() {
        ZoneId zone = ZoneId.systemDefault();
        OffsetDateTime maintStart = targetDate.atTime(12, 0).atZone(zone).toOffsetDateTime();
        OffsetDateTime maintEnd = targetDate.atTime(14, 0).atZone(zone).toOffsetDateTime();

        MaintenanceRequestDTO maint = new MaintenanceRequestDTO();
        maint.setStartTime(maintStart);
        maint.setEndTime(maintEnd);
        maint.setReason("Net and surface repainting");
        courtService.scheduleMaintenance(testCourt.getCourtId(), maint);

        // Try booking during maintenance: 12:30 - 13:30
        BookingRequestDTO req = new BookingRequestDTO();
        req.setCourtId(testCourt.getCourtId());
        req.setMemberId(101L);
        req.setBookingDate(targetDate);
        req.setStartTime(LocalTime.of(12, 30));

        assertThrows(ConflictException.class, () -> {
            bookingService.createBooking(req);
        });
    }
}
