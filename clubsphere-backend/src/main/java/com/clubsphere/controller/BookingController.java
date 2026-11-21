package com.clubsphere.controller;

import com.clubsphere.dto.BookingRequestDTO;
import com.clubsphere.dto.RescheduleRequestDTO;
import com.clubsphere.dto.SlotAvailabilityDTO;
import com.clubsphere.model.BookingWaitlist;
import com.clubsphere.model.CourtBooking;
import com.clubsphere.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        CourtBooking booking = bookingService.createBooking(request);
        String qrImage = bookingService.generateQrCodeBase64(booking.getBookingReference());

        Map<String, Object> response = new HashMap<>();
        response.put("booking", booking);
        response.put("qrCodeDataUri", qrImage);
        response.put("message", "Booking confirmed successfully!");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBooking(@PathVariable Long id) {
        CourtBooking booking = bookingService.getBookingById(id);
        String qrImage = bookingService.generateQrCodeBase64(booking.getBookingReference());

        Map<String, Object> response = new HashMap<>();
        response.put("booking", booking);
        response.put("qrCodeDataUri", qrImage);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<CourtBooking>> getMyBookings(@RequestParam(defaultValue = "101") Long memberId) {
        return ResponseEntity.ok(bookingService.getMemberBookings(memberId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourtBooking>> getAllBookings(
            @RequestParam(required = false) Long courtId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookingService.getAllBookingsFiltered(courtId, date, status));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<CourtBooking> rescheduleBooking(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequestDTO request) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<CourtBooking> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : "Cancelled by user";
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<Map<String, Object>> checkInBookingById(@PathVariable Long id) {
        CourtBooking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(bookingService.checkInBooking(booking.getBookingReference()));
    }

    @PostMapping("/check-in")
    public ResponseEntity<Map<String, Object>> checkInByCode(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        return ResponseEntity.ok(bookingService.checkInBooking(code));
    }

    @PostMapping("/waitlist")
    public ResponseEntity<BookingWaitlist> joinWaitlist(@RequestBody Map<String, Object> body) {
        Long courtId = Long.valueOf(body.get("courtId").toString());
        LocalDate date = LocalDate.parse(body.get("desiredDate").toString());
        LocalTime startTime = LocalTime.parse(body.get("desiredStartTime").toString());
        Long memberId = Long.valueOf(body.getOrDefault("memberId", "101").toString());
        String name = body.getOrDefault("memberName", "Member").toString();
        String phone = body.getOrDefault("memberPhone", "").toString();

        return new ResponseEntity<>(
                bookingService.joinWaitlist(courtId, date, startTime, memberId, name, phone),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/waitlist/my")
    public ResponseEntity<List<BookingWaitlist>> getMyWaitlist(@RequestParam(defaultValue = "101") Long memberId) {
        return ResponseEntity.ok(bookingService.getMemberWaitlist(memberId));
    }
}
