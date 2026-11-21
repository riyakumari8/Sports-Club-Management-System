package com.clubsphere.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "court_bookings")
public class CourtBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "booking_reference", unique = true, nullable = false, length = 30)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "guest_name", length = 100)
    private String guestName;

    @Column(name = "guest_email", length = 100)
    private String guestEmail;

    @Column(name = "guest_phone", length = 20)
    private String guestPhone;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_start_utc", nullable = false)
    private OffsetDateTime slotStartUtc;

    @Column(name = "slot_end_utc", nullable = false)
    private OffsetDateTime slotEndUtc;

    @Column(name = "base_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseAmount;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "booking_status", nullable = false, length = 30)
    private String bookingStatus = "CONFIRMED"; // 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus = "PAID"; // 'PENDING', 'PAID', 'REFUNDED'

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "qr_code_hash", length = 255)
    private String qrCodeHash;

    @Column(name = "checked_in_at")
    private OffsetDateTime checkedInAt;

    @Column(name = "cancellation_reason", length = 255)
    private String cancellationReason;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public CourtBooking() {}

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Court getCourt() { return court; }
    public void setCourt(Court court) { this.court = court; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public OffsetDateTime getSlotStartUtc() { return slotStartUtc; }
    public void setSlotStartUtc(OffsetDateTime slotStartUtc) { this.slotStartUtc = slotStartUtc; }

    public OffsetDateTime getSlotEndUtc() { return slotEndUtc; }
    public void setSlotEndUtc(OffsetDateTime slotEndUtc) { this.slotEndUtc = slotEndUtc; }

    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getQrCodeHash() { return qrCodeHash; }
    public void setQrCodeHash(String qrCodeHash) { this.qrCodeHash = qrCodeHash; }

    public OffsetDateTime getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(OffsetDateTime checkedInAt) { this.checkedInAt = checkedInAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
