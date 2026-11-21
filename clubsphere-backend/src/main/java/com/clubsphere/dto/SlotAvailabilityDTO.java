package com.clubsphere.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public class SlotAvailabilityDTO {
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
    private String statusReason;
    private BigDecimal memberPrice;
    private BigDecimal guestPrice;
    private String bookingReference;

    public SlotAvailabilityDTO() {}

    public SlotAvailabilityDTO(LocalTime startTime, LocalTime endTime, boolean available, 
                               String statusReason, BigDecimal memberPrice, BigDecimal guestPrice) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
        this.statusReason = statusReason;
        this.memberPrice = memberPrice;
        this.guestPrice = guestPrice;
    }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public String getStatusReason() { return statusReason; }
    public void setStatusReason(String statusReason) { this.statusReason = statusReason; }

    public BigDecimal getMemberPrice() { return memberPrice; }
    public void setMemberPrice(BigDecimal memberPrice) { this.memberPrice = memberPrice; }

    public BigDecimal getGuestPrice() { return guestPrice; }
    public void setGuestPrice(BigDecimal guestPrice) { this.guestPrice = guestPrice; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
}
