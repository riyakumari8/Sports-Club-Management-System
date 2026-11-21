package com.clubsphere.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class RescheduleRequestDTO {

    private Long newCourtId; // Optional, can stay on same court or change

    @NotNull(message = "New booking date is required")
    private LocalDate newBookingDate;

    @NotNull(message = "New start time is required")
    private LocalTime newStartTime;

    public RescheduleRequestDTO() {}

    public Long getNewCourtId() { return newCourtId; }
    public void setNewCourtId(Long newCourtId) { this.newCourtId = newCourtId; }

    public LocalDate getNewBookingDate() { return newBookingDate; }
    public void setNewBookingDate(LocalDate newBookingDate) { this.newBookingDate = newBookingDate; }

    public LocalTime getNewStartTime() { return newStartTime; }
    public void setNewStartTime(LocalTime newStartTime) { this.newStartTime = newStartTime; }
}
