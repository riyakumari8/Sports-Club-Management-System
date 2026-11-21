package com.clubsphere.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class TrialBookingRequestDTO {

    private Long courtId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Preferred sport is required")
    private String preferredSport;

    @NotNull(message = "Trial date is required")
    private LocalDate trialDate;

    @NotNull(message = "Preferred start time is required")
    private LocalTime startTime;

    public TrialBookingRequestDTO() {}

    public Long getCourtId() { return courtId; }
    public void setCourtId(Long courtId) { this.courtId = courtId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPreferredSport() { return preferredSport; }
    public void setPreferredSport(String preferredSport) { this.preferredSport = preferredSport; }

    public LocalDate getTrialDate() { return trialDate; }
    public void setTrialDate(LocalDate trialDate) { this.trialDate = trialDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
}
