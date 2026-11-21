package com.clubsphere.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "courts")
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "court_id")
    private Long courtId;

    @Column(name = "court_name", nullable = false, length = 100)
    private String courtName;

    @Column(name = "sport_type", nullable = false, length = 50)
    private String sportType; // 'TENNIS', 'CRICKET', etc.

    @Column(name = "court_description", columnDefinition = "TEXT")
    private String courtDescription;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "surface_type", length = 50)
    private String surfaceType;

    @Column(name = "capacity")
    private Integer capacity = 4;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime = LocalTime.of(6, 0);

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime = LocalTime.of(22, 0);

    @Column(name = "standard_hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal standardHourlyRate = BigDecimal.valueOf(500.00);

    @Column(name = "guest_hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal guestHourlyRate = BigDecimal.valueOf(750.00);

    @Column(name = "court_status", nullable = false, length = 50)
    private String courtStatus = "AVAILABLE"; // 'AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'TEMPORARILY_CLOSED'

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "image_url")
    private String imageUrl;

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

    // Default constructor
    public Court() {}

    // Getters and Setters
    public Long getCourtId() { return courtId; }
    public void setCourtId(Long courtId) { this.courtId = courtId; }

    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }

    public String getSportType() { return sportType; }
    public void setSportType(String sportType) { this.sportType = sportType; }

    public String getCourtDescription() { return courtDescription; }
    public void setCourtDescription(String courtDescription) { this.courtDescription = courtDescription; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSurfaceType() { return surfaceType; }
    public void setSurfaceType(String surfaceType) { this.surfaceType = surfaceType; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }

    public LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }

    public BigDecimal getStandardHourlyRate() { return standardHourlyRate; }
    public void setStandardHourlyRate(BigDecimal standardHourlyRate) { this.standardHourlyRate = standardHourlyRate; }

    public BigDecimal getGuestHourlyRate() { return guestHourlyRate; }
    public void setGuestHourlyRate(BigDecimal guestHourlyRate) { this.guestHourlyRate = guestHourlyRate; }

    public String getCourtStatus() { return courtStatus; }
    public void setCourtStatus(String courtStatus) { this.courtStatus = courtStatus; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
