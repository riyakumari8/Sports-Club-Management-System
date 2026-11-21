package com.clubsphere.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class FollowupRequestDTO {

    @NotBlank(message = "Followup note cannot be blank")
    private String notes;

    private LocalDate nextFollowupDate;

    @NotBlank(message = "Staff name is required")
    private String staffName;

    private String updatedStatus; // Optional status update (e.g., CONTACTED, FOLLOW_UP_REQUIRED, CONVERTED, CLOSED)

    public FollowupRequestDTO() {}

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getNextFollowupDate() { return nextFollowupDate; }
    public void setNextFollowupDate(LocalDate nextFollowupDate) { this.nextFollowupDate = nextFollowupDate; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getUpdatedStatus() { return updatedStatus; }
    public void setUpdatedStatus(String updatedStatus) { this.updatedStatus = updatedStatus; }
}
