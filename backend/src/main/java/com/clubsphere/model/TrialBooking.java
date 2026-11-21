package com.clubsphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "trial_bookings")
public class TrialBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trial_id")
    private Long trialId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "court_id")
    private Court court;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "preferred_sport", nullable = false, length = 50)
    private String preferredSport;

    @Column(name = "trial_date", nullable = false)
    private LocalDate trialDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING"; // 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public TrialBooking() {}

    public Long getTrialId() { return trialId; }
    public void setTrialId(Long trialId) { this.trialId = trialId; }

    public Court getCourt() { return court; }
    public void setCourt(Court court) { this.court = court; }

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

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStaffNotes() { return staffNotes; }
    public void setStaffNotes(String staffNotes) { this.staffNotes = staffNotes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
