package com.clubsphere.service;

import com.clubsphere.dto.BookingRequestDTO;
import com.clubsphere.dto.RescheduleRequestDTO;
import com.clubsphere.dto.SlotAvailabilityDTO;
import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ConflictException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.model.BookingWaitlist;
import com.clubsphere.model.Court;
import com.clubsphere.model.CourtBooking;
import com.clubsphere.model.CourtMaintenance;
import com.clubsphere.repository.BookingWaitlistRepository;
import com.clubsphere.repository.CourtBookingRepository;
import com.clubsphere.repository.CourtMaintenanceRepository;
import com.clubsphere.repository.CourtRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class BookingService {

    private final CourtBookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final CourtMaintenanceRepository maintenanceRepository;
    private final BookingWaitlistRepository waitlistRepository;
    private final MembershipClientService membershipClientService;
    private final NotificationService notificationService;
    private final com.clubsphere.modules.membership.repository.MemberRepository memberRepository;

    public BookingService(CourtBookingRepository bookingRepository,
                          CourtRepository courtRepository,
                          CourtMaintenanceRepository maintenanceRepository,
                          BookingWaitlistRepository waitlistRepository,
                          MembershipClientService membershipClientService,
                          NotificationService notificationService,
                          com.clubsphere.modules.membership.repository.MemberRepository memberRepository) {
        this.bookingRepository = bookingRepository;
        this.courtRepository = courtRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.waitlistRepository = waitlistRepository;
        this.membershipClientService = membershipClientService;
        this.notificationService = notificationService;
        this.memberRepository = memberRepository;
    }

    /**
     * Generate 30-minute availability matrix for a court on a given date.
     * Each booking is strictly 60 minutes long.
     */
    @Transactional(readOnly = true)
    public List<SlotAvailabilityDTO> getCourtSlotAvailability(Long courtId, LocalDate date) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + courtId));

        List<CourtBooking> activeBookings = bookingRepository.findByCourtCourtIdAndBookingDateAndBookingStatusIn(
                courtId, date, List.of("CONFIRMED", "PENDING"));

        // Fetch maintenance intervals
        ZoneId zone = ZoneId.systemDefault();
        OffsetDateTime dayStart = date.atStartOfDay(zone).toOffsetDateTime();
        OffsetDateTime dayEnd = date.plusDays(1).atStartOfDay(zone).toOffsetDateTime();
        List<CourtMaintenance> maintenances = maintenanceRepository.findOverlappingMaintenance(courtId, dayStart, dayEnd);

        LocalTime opening = court.getOpeningTime();
        LocalTime closing = court.getClosingTime();
        if (closing == null || opening == null || closing.isBefore(opening)) {
            opening = LocalTime.of(6, 0);
            closing = LocalTime.of(22, 0);
        }

        List<SlotAvailabilityDTO> slots = new ArrayList<>();
        LocalTime currentSlotStart = opening;
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        while (!currentSlotStart.plusHours(1).isAfter(closing)) {
            LocalTime currentSlotEnd = currentSlotStart.plusHours(1);

            boolean isPast = date.isBefore(today) || (date.isEqual(today) && currentSlotStart.isBefore(now));
            boolean isUnderMaintenance = false;
            String maintenanceReason = null;

            OffsetDateTime slotStartUtc = date.atTime(currentSlotStart).atZone(zone).toOffsetDateTime();
            OffsetDateTime slotEndUtc = date.atTime(currentSlotEnd).atZone(zone).toOffsetDateTime();

            for (CourtMaintenance m : maintenances) {
                if (m.getStartTime().isBefore(slotEndUtc) && m.getEndTime().isAfter(slotStartUtc)) {
                    isUnderMaintenance = true;
                    maintenanceReason = m.getReason();
                    break;
                }
            }

            // Check if any existing booking overlaps: S1 < E2 and S2 < E1
            CourtBooking conflictingBooking = null;
            for (CourtBooking b : activeBookings) {
                if (b.getStartTime().isBefore(currentSlotEnd) && b.getEndTime().isAfter(currentSlotStart)) {
                    conflictingBooking = b;
                    break;
                }
            }

            boolean available = !isPast && !isUnderMaintenance && conflictingBooking == null && !"UNDER_MAINTENANCE".equalsIgnoreCase(court.getCourtStatus()) && !"TEMPORARILY_CLOSED".equalsIgnoreCase(court.getCourtStatus());
            String reason = "Available";
            String bookingRef = null;

            if (isPast) {
                reason = "Past Slot";
            } else if ("UNDER_MAINTENANCE".equalsIgnoreCase(court.getCourtStatus()) || isUnderMaintenance) {
                reason = "Under Maintenance: " + (maintenanceReason != null ? maintenanceReason : "Court blocked");
            } else if ("TEMPORARILY_CLOSED".equalsIgnoreCase(court.getCourtStatus())) {
                reason = "Court Temporarily Closed";
            } else if (conflictingBooking != null) {
                reason = "Booked";
                bookingRef = conflictingBooking.getBookingReference();
            }

            SlotAvailabilityDTO slotDTO = new SlotAvailabilityDTO(
                    currentSlotStart,
                    currentSlotEnd,
                    available,
                    reason,
                    court.getStandardHourlyRate(),
                    court.getGuestHourlyRate()
            );
            slotDTO.setBookingReference(bookingRef);
            slots.add(slotDTO);

            // Increment by 30 minutes for staggered start
            currentSlotStart = currentSlotStart.plusMinutes(30);
        }

        return slots;
    }

    /**
     * Create Court Booking with strict 10-step validation and database pessimistic concurrency lock.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public CourtBooking createBooking(BookingRequestDTO request) {
        // Step 1: Pessimistic Lock on Court row
        Court court = courtRepository.findByIdForUpdate(request.getCourtId())
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + request.getCourtId()));

        if (!Boolean.TRUE.equals(court.getIsActive())) {
            throw new BadRequestException("This court is inactive and cannot be booked.");
        }

        LocalDate bookingDate = request.getBookingDate();
        LocalTime startTime = request.getStartTime();
        LocalTime endTime = startTime.plusHours(1);

        // Step 2: Validate past slot
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (bookingDate.isBefore(today) || (bookingDate.isEqual(today) && startTime.isBefore(now))) {
            throw new BadRequestException("Cannot book a time slot in the past.");
        }

        // Step 3: Validate Operating Hours
        LocalTime opening = court.getOpeningTime() != null ? court.getOpeningTime() : LocalTime.of(6, 0);
        LocalTime closing = court.getClosingTime() != null ? court.getClosingTime() : LocalTime.of(22, 0);
        if (closing.isBefore(opening)) {
            opening = LocalTime.of(6, 0);
            closing = LocalTime.of(22, 0);
        }
        if (startTime.isBefore(opening) || endTime.isAfter(closing)) {
            throw new BadRequestException(String.format("Booking must be within operating hours (%s - %s)",
                    opening, closing));
        }

        // Step 4: Maintenance check
        ZoneId zone = ZoneId.systemDefault();
        OffsetDateTime slotStartUtc = bookingDate.atTime(startTime).atZone(zone).toOffsetDateTime();
        OffsetDateTime slotEndUtc = bookingDate.atTime(endTime).atZone(zone).toOffsetDateTime();

        List<CourtMaintenance> maintenances = maintenanceRepository.findOverlappingMaintenance(
                court.getCourtId(), slotStartUtc, slotEndUtc);
        if (!maintenances.isEmpty()) {
            throw new ConflictException("Court is scheduled for maintenance during this time slot: " +
                    maintenances.get(0).getReason());
        }

        // Step 5: Enforce Daily Booking Limit (Max 2 regular sessions per member per day)
        if (request.getMemberId() != null) {
            long dailyCount = bookingRepository.countDailyBookingsForMember(request.getMemberId(), bookingDate, null);
            if (dailyCount >= 2) {
                throw new BadRequestException("Daily limit reached: Members can book a maximum of 2 regular sessions per day.");
            }
        }

        // Step 6: Overlap check against existing regular bookings
        List<CourtBooking> overlapping = bookingRepository.findOverlappingBookings(
                court.getCourtId(), bookingDate, startTime, endTime, null);
        if (!overlapping.isEmpty()) {
            throw new ConflictException("Slot unavailable: A confirmed booking already exists on this court from " +
                    overlapping.get(0).getStartTime() + " to " + overlapping.get(0).getEndTime());
        }

        // Step 7: Pricing & Membership Discount Calculation
        BigDecimal baseAmount = (request.getMemberId() != null) ? court.getStandardHourlyRate() : court.getGuestHourlyRate();
        BigDecimal finalAmount = baseAmount;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getMemberId() != null) {
            String tier = request.getMemberTier() != null ? request.getMemberTier() : "SILVER";
            finalAmount = membershipClientService.calculateDiscountedPrice(baseAmount, tier);
            discountAmount = baseAmount.subtract(finalAmount);
        }

        // Step 8: Build Entity & Reference
        CourtBooking booking = new CourtBooking();
        booking.setCourt(court);
        booking.setMemberId(request.getMemberId());
        booking.setGuestName(request.getGuestName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setGuestPhone(request.getGuestPhone());
        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setSlotStartUtc(slotStartUtc);
        booking.setSlotEndUtc(slotEndUtc);
        booking.setBaseAmount(baseAmount);
        booking.setDiscountAmount(discountAmount);
        booking.setFinalAmount(finalAmount);
        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentStatus("PAID");
        booking.setPaymentReference(request.getPaymentReference() != null ?
                request.getPaymentReference() : "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        String reference = generateBookingReference(bookingDate);
        booking.setBookingReference(reference);

        // Step 9: QR Code Generation
        String qrHash = generateQrHash(reference, court.getCourtId(), bookingDate, startTime);
        booking.setQrCodeHash(qrHash);

        // Step 10: Persist (PostgreSQL GiST exclusion constraint guarantees atomicity)
        CourtBooking saved = bookingRepository.save(booking);

        if (saved.getMemberId() != null) {
            memberRepository.findById(saved.getMemberId()).ifPresent(mem -> {
                if (mem.getUser() != null) {
                    notificationService.createNotification(
                            mem.getUser().getId(),
                            "Court Booking Confirmed: " + reference,
                            "Your reservation for " + court.getCourtName() + " on " + bookingDate + " from " + startTime + " to " + endTime + " is confirmed.",
                            "BOOKING"
                    );
                }
            });
        }

        return saved;
    }

    /**
     * Reschedule an existing booking to an alternative available slot.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public CourtBooking rescheduleBooking(Long bookingId, RescheduleRequestDTO request) {
        CourtBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Only CONFIRMED bookings can be rescheduled. Current status: " + booking.getBookingStatus());
        }

        Long targetCourtId = request.getNewCourtId() != null ? request.getNewCourtId() : booking.getCourt().getCourtId();
        Court court = courtRepository.findByIdForUpdate(targetCourtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + targetCourtId));

        LocalDate newDate = request.getNewBookingDate();
        LocalTime newStartTime = request.getNewStartTime();
        LocalTime newEndTime = newStartTime.plusHours(1);

        // Validate future
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (newDate.isBefore(today) || (newDate.isEqual(today) && newStartTime.isBefore(now))) {
            throw new BadRequestException("New slot cannot be in the past.");
        }

        // Validate operating hours
        LocalTime opening = court.getOpeningTime() != null ? court.getOpeningTime() : LocalTime.of(6, 0);
        LocalTime closing = court.getClosingTime() != null ? court.getClosingTime() : LocalTime.of(22, 0);
        if (closing.isBefore(opening)) {
            opening = LocalTime.of(6, 0);
            closing = LocalTime.of(22, 0);
        }
        if (newStartTime.isBefore(opening) || newEndTime.isAfter(closing)) {
            throw new BadRequestException(String.format("New slot is outside court operating hours (%s - %s)",
                    opening, closing));
        }

        // Check maintenance
        ZoneId zone = ZoneId.systemDefault();
        OffsetDateTime slotStartUtc = newDate.atTime(newStartTime).atZone(zone).toOffsetDateTime();
        OffsetDateTime slotEndUtc = newDate.atTime(newEndTime).atZone(zone).toOffsetDateTime();

        List<CourtMaintenance> maintenances = maintenanceRepository.findOverlappingMaintenance(
                targetCourtId, slotStartUtc, slotEndUtc);
        if (!maintenances.isEmpty()) {
            throw new ConflictException("New slot overlaps with maintenance: " + maintenances.get(0).getReason());
        }

        // Daily limit check on new date if date changed
        if (booking.getMemberId() != null && !newDate.isEqual(booking.getBookingDate())) {
            long count = bookingRepository.countDailyBookingsForMember(booking.getMemberId(), newDate, booking.getBookingId());
            if (count >= 2) {
                throw new BadRequestException("Member already has 2 bookings on the selected new date.");
            }
        }

        // Overlap check on target court
        List<CourtBooking> overlapping = bookingRepository.findOverlappingBookings(
                targetCourtId, newDate, newStartTime, newEndTime, booking.getBookingId());
        if (!overlapping.isEmpty()) {
            throw new ConflictException("The selected alternative slot is already booked.");
        }

        booking.setCourt(court);
        booking.setBookingDate(newDate);
        booking.setStartTime(newStartTime);
        booking.setEndTime(newEndTime);
        booking.setSlotStartUtc(slotStartUtc);
        booking.setSlotEndUtc(slotEndUtc);

        // Regenerate QR Hash for new schedule
        booking.setQrCodeHash(generateQrHash(booking.getBookingReference(), targetCourtId, newDate, newStartTime));

        return bookingRepository.save(booking);
    }

    /**
     * Cancel an eligible booking.
     */
    public CourtBooking cancelBooking(Long bookingId, String reason) {
        CourtBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus("REFUNDED");
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");

        CourtBooking saved = bookingRepository.save(booking);

        // Check and notify waitlist candidates if any
        notifyWaitlistCandidates(booking.getCourt().getCourtId(), booking.getBookingDate(), booking.getStartTime());

        return saved;
    }

    /**
     * QR-based check-in verification at the club front desk.
     */
    public Map<String, Object> checkInBooking(String identifier) {
        // Can check-in by booking reference or QR code hash
        CourtBooking booking = bookingRepository.findByBookingReference(identifier)
                .or(() -> bookingRepository.findByQrCodeHash(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("No booking found for check-in code: " + identifier));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Cannot check-in. Booking status is " + booking.getBookingStatus());
        }

        if (booking.getCheckedInAt() != null) {
            throw new ConflictException(String.format("Duplicate check-in prohibited! This booking was already checked in at %s.",
                    booking.getCheckedInAt().format(DateTimeFormatter.ofPattern("hh:mm a, dd MMM yyyy"))));
        }

        booking.setCheckedInAt(OffsetDateTime.now());
        booking.setBookingStatus("COMPLETED");
        CourtBooking updated = bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Check-in successful! Welcome to ClubSphere.");
        response.put("bookingReference", updated.getBookingReference());
        response.put("courtName", updated.getCourt().getCourtName());
        response.put("sportType", updated.getCourt().getSportType());
        response.put("sessionTime", updated.getStartTime() + " - " + updated.getEndTime());
        response.put("checkedInAt", updated.getCheckedInAt());
        return response;
    }

    /**
     * Generate Base64 QR Code image PNG data URI for client ticket display.
     */
    public String generateQrCodeBase64(String qrPayload) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrPayload, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            return null;
        }
    }

    // Waitlist support
    public BookingWaitlist joinWaitlist(Long courtId, LocalDate date, LocalTime startTime, Long memberId, String name, String phone) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + courtId));

        List<BookingWaitlist> existing = waitlistRepository.findByCourtCourtIdAndDesiredDateAndDesiredStartTimeAndStatusOrderByQueuePositionAsc(
                courtId, date, startTime, "WAITING");

        BookingWaitlist waitlist = new BookingWaitlist();
        waitlist.setCourt(court);
        waitlist.setDesiredDate(date);
        waitlist.setDesiredStartTime(startTime);
        waitlist.setMemberId(memberId);
        waitlist.setMemberName(name);
        waitlist.setMemberPhone(phone);
        waitlist.setQueuePosition(existing.size() + 1);
        waitlist.setStatus("WAITING");

        return waitlistRepository.save(waitlist);
    }

    public List<BookingWaitlist> getMemberWaitlist(Long memberId) {
        return waitlistRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
    }

    private void notifyWaitlistCandidates(Long courtId, LocalDate date, LocalTime startTime) {
        List<BookingWaitlist> waitlist = waitlistRepository.findByCourtCourtIdAndDesiredDateAndDesiredStartTimeAndStatusOrderByQueuePositionAsc(
                courtId, date, startTime, "WAITING");
        if (!waitlist.isEmpty()) {
            BookingWaitlist first = waitlist.get(0);
            first.setStatus("NOTIFIED");
            waitlistRepository.save(first);
        }
    }

    public List<CourtBooking> getMemberBookings(Long memberId) {
        return bookingRepository.findByMemberIdOrderByBookingDateDescStartTimeDesc(memberId);
    }

    public List<CourtBooking> getAllBookingsFiltered(Long courtId, LocalDate date, String status) {
        if (courtId == null && date == null && (status == null || status.isBlank())) {
            return bookingRepository.findAll();
        }
        return bookingRepository.findBookingsFiltered(courtId, date, (status != null && !status.isBlank()) ? status : null);
    }

    public CourtBooking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private String generateBookingReference(LocalDate date) {
        String dateStr = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String rand = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return "CS-" + dateStr + "-" + rand;
    }

    private String generateQrHash(String reference, Long courtId, LocalDate date, LocalTime startTime) {
        try {
            String raw = reference + "|" + courtId + "|" + date + "|" + startTime + "|CLUBSPHERE_SECRET";
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().substring(0, 32);
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
