package com.clubsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class SocialPlayCreateDTO {

    @NotNull(message = "Court ID is required")
    private Long courtId;

    @NotBlank(message = "Title is required")
    private String title = "Friday Social Play";

    @NotNull(message = "Date is required")
    private LocalDate sessionDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime = LocalTime.of(18, 0);

    @NotNull(message = "End time is required")
    private LocalTime endTime = LocalTime.of(21, 0);

    @NotNull(message = "Max participants is required")
    @Positive(message = "Max participants must be positive")
    private Integer maxParticipants = 16;

    @NotNull(message = "Entry fee is required")
    private BigDecimal entryFee = BigDecimal.valueOf(150.00);

    public SocialPlayCreateDTO() {}

    public Long getCourtId() { return courtId; }
    public void setCourtId(Long courtId) { this.courtId = courtId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public BigDecimal getEntryFee() { return entryFee; }
    public void setEntryFee(BigDecimal entryFee) { this.entryFee = entryFee; }
}
