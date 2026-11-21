package com.clubsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "social_play_participants")
public class SocialPlayParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private SocialPlaySession session;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "participant_name", nullable = false, length = 100)
    private String participantName;

    @Column(name = "participant_email", length = 100)
    private String participantEmail;

    @Column(name = "payment_status", length = 30)
    private String paymentStatus = "PAID";

    @Column(name = "registered_at", updatable = false)
    private OffsetDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        this.registeredAt = OffsetDateTime.now();
    }

    public SocialPlayParticipant() {}

    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }

    public SocialPlaySession getSession() { return session; }
    public void setSession(SocialPlaySession session) { this.session = session; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getParticipantEmail() { return participantEmail; }
    public void setParticipantEmail(String participantEmail) { this.participantEmail = participantEmail; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public OffsetDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(OffsetDateTime registeredAt) { this.registeredAt = registeredAt; }
}
