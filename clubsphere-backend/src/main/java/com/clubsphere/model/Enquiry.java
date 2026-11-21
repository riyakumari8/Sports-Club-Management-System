package com.clubsphere.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_id")
    private Long enquiryId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "interested_sport", length = 50)
    private String interestedSport;

    @Column(name = "interested_plan", length = 50)
    private String interestedPlan; // 'GOLD', 'SILVER', 'JUNIOR'

    @Column(name = "enquiry_message", columnDefinition = "TEXT")
    private String enquiryMessage;

    @Column(name = "preferred_contact_method", length = 30)
    private String preferredContactMethod = "PHONE"; // 'PHONE', 'EMAIL', 'WHATSAPP'

    @Column(name = "status", nullable = false, length = 30)
    private String status = "NEW"; // 'NEW', 'CONTACTED', 'FOLLOW_UP_REQUIRED', 'CONVERTED', 'CLOSED'

    @Column(name = "assigned_staff_id")
    private Long assignedStaffId;

    @Column(name = "assigned_staff_name", length = 100)
    private String assignedStaffName;

    @Column(name = "converted_member_id")
    private Long convertedMemberId;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "enquiry", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EnquiryFollowup> followups = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Enquiry() {}

    public Long getEnquiryId() { return enquiryId; }
    public void setEnquiryId(Long enquiryId) { this.enquiryId = enquiryId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getInterestedSport() { return interestedSport; }
    public void setInterestedSport(String interestedSport) { this.interestedSport = interestedSport; }

    public String getInterestedPlan() { return interestedPlan; }
    public void setInterestedPlan(String interestedPlan) { this.interestedPlan = interestedPlan; }

    public String getEnquiryMessage() { return enquiryMessage; }
    public void setEnquiryMessage(String enquiryMessage) { this.enquiryMessage = enquiryMessage; }

    public String getPreferredContactMethod() { return preferredContactMethod; }
    public void setPreferredContactMethod(String preferredContactMethod) { this.preferredContactMethod = preferredContactMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public Long getConvertedMemberId() { return convertedMemberId; }
    public void setConvertedMemberId(Long convertedMemberId) { this.convertedMemberId = convertedMemberId; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<EnquiryFollowup> getFollowups() { return followups; }
    public void setFollowups(List<EnquiryFollowup> followups) { this.followups = followups; }
}
