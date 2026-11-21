package com.clubsphere.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EnquiryRequestDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String interestedSport;
    private String interestedPlan; // GOLD, SILVER, JUNIOR
    private String enquiryMessage;
    private String preferredContactMethod = "PHONE"; // PHONE, EMAIL, WHATSAPP

    public EnquiryRequestDTO() {}

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
}
