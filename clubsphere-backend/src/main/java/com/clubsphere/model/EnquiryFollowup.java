package com.clubsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "enquiry_followups")
public class EnquiryFollowup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "followup_id")
    private Long followupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id", nullable = false)
    @JsonIgnore
    private Enquiry enquiry;

    @Column(name = "notes", nullable = false, columnDefinition = "TEXT")
    private String notes;

    @Column(name = "contact_date")
    private OffsetDateTime contactDate = OffsetDateTime.now();

    @Column(name = "next_followup_date")
    private LocalDate nextFollowupDate;

    @Column(name = "created_by_staff", nullable = false, length = 100)
    private String createdByStaff;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        if (this.contactDate == null) {
            this.contactDate = OffsetDateTime.now();
        }
    }

    public EnquiryFollowup() {}

    public Long getFollowupId() { return followupId; }
    public void setFollowupId(Long followupId) { this.followupId = followupId; }

    public Enquiry getEnquiry() { return enquiry; }
    public void setEnquiry(Enquiry enquiry) { this.enquiry = enquiry; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public OffsetDateTime getContactDate() { return contactDate; }
    public void setContactDate(OffsetDateTime contactDate) { this.contactDate = contactDate; }

    public LocalDate getNextFollowupDate() { return nextFollowupDate; }
    public void setNextFollowupDate(LocalDate nextFollowupDate) { this.nextFollowupDate = nextFollowupDate; }

    public String getCreatedByStaff() { return createdByStaff; }
    public void setCreatedByStaff(String createdByStaff) { this.createdByStaff = createdByStaff; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
