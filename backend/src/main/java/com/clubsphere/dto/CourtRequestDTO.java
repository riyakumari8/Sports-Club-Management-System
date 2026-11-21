package com.clubsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalTime;

public class CourtRequestDTO {

    @NotBlank(message = "Court name is required")
    private String courtName;

    @NotBlank(message = "Sport type is required (e.g., TENNIS, CRICKET)")
    private String sportType;

    private String courtDescription;
    private String location;
    private String surfaceType;
    private Integer capacity = 4;

    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;

    @NotNull(message = "Standard hourly rate is required")
    @Positive(message = "Standard rate must be greater than zero")
    private BigDecimal standardHourlyRate;

    @NotNull(message = "Guest hourly rate is required")
    @Positive(message = "Guest rate must be greater than zero")
    private BigDecimal guestHourlyRate;

    private String courtStatus = "AVAILABLE";
    private Boolean isActive = true;
    private String imageUrl;

    public CourtRequestDTO() {}

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
}
