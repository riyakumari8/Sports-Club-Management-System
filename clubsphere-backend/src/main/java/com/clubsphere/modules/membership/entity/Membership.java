package com.clubsphere.modules.membership.entity;

import com.clubsphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;

    @Column(name = "membership_number", nullable = false, unique = true, length = 50)
    private String membershipNumber; // e.g. CS-MEM-2026-00101

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, PENDING_PAYMENT, SUSPENDED, CANCELLED

    @Column(name = "qr_code_token", nullable = false, unique = true)
    private String qrCodeToken;

    @Column(name = "auto_renew", nullable = false)
    @Builder.Default
    private Boolean autoRenew = false;

    public boolean isCurrentlyActive() {
        return "ACTIVE".equalsIgnoreCase(this.status) &&
                !LocalDate.now().isBefore(startDate) &&
                !LocalDate.now().isAfter(endDate);
    }
}
