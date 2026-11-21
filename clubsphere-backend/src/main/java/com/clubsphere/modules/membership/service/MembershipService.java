package com.clubsphere.modules.membership.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.common.utils.QrCodeUtil;
import com.clubsphere.modules.membership.dto.*;
import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.entity.Membership;
import com.clubsphere.modules.membership.entity.MembershipPlan;
import com.clubsphere.modules.membership.entity.MembershipTransaction;
import com.clubsphere.modules.membership.repository.MemberRepository;
import com.clubsphere.modules.membership.repository.MembershipPlanRepository;
import com.clubsphere.modules.membership.repository.MembershipRepository;
import com.clubsphere.modules.membership.repository.MembershipTransactionRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MemberRepository memberRepository;
    private final MembershipPlanRepository planRepository;
    private final MembershipTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final com.clubsphere.service.NotificationService notificationService;

    @Transactional
    public MembershipResponseDto registerMembership(Long userId, MembershipRegistrationRequest req) {
        Member member;
        if (req.getMemberId() != null) {
            // Admin registering for a specific member
            member = memberRepository.findById(req.getMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + req.getMemberId()));
        } else {
            // User registering for self
            member = memberRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Member profile not found for user: " + userId));
        }

        // Enforce ONE active membership policy (Section 11)
        membershipRepository.findFirstByMemberAndStatusOrderByEndDateDesc(member, "ACTIVE").ifPresent(active -> {
            throw new BadRequestException("Member already has an active membership (" + 
                    active.getMembershipNumber() + " - " + active.getPlan().getName() + 
                    "). ClubSphere policy strictly permits only ONE active membership per member. Please renew or upgrade your existing plan.");
        });

        MembershipPlan plan = planRepository.findById(req.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found: " + req.getPlanId()));

        if (!Boolean.TRUE.equals(plan.getIsActive())) {
            throw new BadRequestException("Selected membership plan is currently inactive");
        }

        // Age restriction validation (e.g. Junior membership < 18)
        User user = member.getUser();
        if (user.getDateOfBirth() != null) {
            int age = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
            if (plan.getMinAge() != null && age < plan.getMinAge()) {
                throw new BadRequestException("Member age (" + age + ") is below minimum age requirement (" + plan.getMinAge() + ") for " + plan.getName());
            }
            if (plan.getMaxAge() != null && age > plan.getMaxAge()) {
                throw new BadRequestException("Member age (" + age + ") exceeds maximum age limit (" + plan.getMaxAge() + ") for " + plan.getName() + " (Junior Membership requires under 18)");
            }
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(plan.getDurationDays());

        String membershipNumber = String.format("CS-MEM-%d-%05d", LocalDate.now().getYear(), System.currentTimeMillis() % 100000);
        String qrCodeToken = UUID.randomUUID().toString();

        Membership membership = Membership.builder()
                .member(member)
                .plan(plan)
                .membershipNumber(membershipNumber)
                .startDate(startDate)
                .endDate(endDate)
                .status("ACTIVE")
                .qrCodeToken(qrCodeToken)
                .autoRenew(false)
                .build();

        membership = membershipRepository.save(membership);

        // Record transaction
        String txRef = "TXN-REG-" + System.currentTimeMillis();
        MembershipTransaction transaction = MembershipTransaction.builder()
                .membership(membership)
                .member(member)
                .transactionType("NEW_REGISTRATION")
                .amount(plan.getPrice())
                .paymentMethod(req.getPaymentMethod().toUpperCase())
                .paymentStatus("PAID")
                .transactionReference(txRef)
                .paidAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        // Notify member
        if (member.getUser() != null) {
            notificationService.createNotification(
                    member.getUser().getId(),
                    "Membership Activated: " + plan.getName(),
                    "Welcome! Your " + plan.getName() + " is active until " + endDate + ". Digital QR pass generated.",
                    "MEMBERSHIP"
            );
        }

        return mapToResponseDto(membership);
    }

    @Transactional
    public MembershipResponseDto renewMembership(Long membershipId, RenewalRequest req) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found: " + membershipId));

        MembershipPlan plan = membership.getPlan();
        LocalDate today = LocalDate.now();

        LocalDate newStartDate;
        LocalDate newEndDate;

        if (membership.getEndDate().isAfter(today)) {
            // Not expired yet: extend from current end date
            newStartDate = membership.getStartDate();
            newEndDate = membership.getEndDate().plusDays(plan.getDurationDays());
        } else {
            // Already expired: start fresh from today
            newStartDate = today;
            newEndDate = today.plusDays(plan.getDurationDays());
        }

        membership.setStartDate(newStartDate);
        membership.setEndDate(newEndDate);
        membership.setStatus("ACTIVE");
        membership = membershipRepository.save(membership);

        // Record transaction
        String txRef = "TXN-RNW-" + System.currentTimeMillis();
        MembershipTransaction transaction = MembershipTransaction.builder()
                .membership(membership)
                .member(membership.getMember())
                .transactionType("RENEWAL")
                .amount(plan.getPrice())
                .paymentMethod(req.getPaymentMethod().toUpperCase())
                .paymentStatus("PAID")
                .transactionReference(txRef)
                .paidAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        // Notify member
        if (membership.getMember().getUser() != null) {
            notificationService.createNotification(
                    membership.getMember().getUser().getId(),
                    "Membership Renewed: " + plan.getName(),
                    "Your renewal payment was successful. Valid through " + newEndDate + ".",
                    "MEMBERSHIP"
            );
        }

        return mapToResponseDto(membership);
    }

    @Transactional
    public MembershipResponseDto upgradeMembership(Long currentMembershipId, UpgradeRequest req) {
        Membership currentMembership = membershipRepository.findById(currentMembershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Current membership not found: " + currentMembershipId));

        MembershipPlan newPlan = planRepository.findById(req.getNewPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("New plan not found: " + req.getNewPlanId()));

        if (!Boolean.TRUE.equals(newPlan.getIsActive())) {
            throw new BadRequestException("Selected upgrade plan is currently inactive");
        }

        Member member = currentMembership.getMember();

        // Mark existing membership as SUPERSEDED to preserve historical records
        currentMembership.setStatus("SUPERSEDED");
        membershipRepository.save(currentMembership);

        // Create new upgraded membership
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(newPlan.getDurationDays());
        String membershipNumber = String.format("CS-MEM-%d-%05d", LocalDate.now().getYear(), System.currentTimeMillis() % 100000);
        String qrCodeToken = UUID.randomUUID().toString();

        Membership newMembership = Membership.builder()
                .member(member)
                .plan(newPlan)
                .membershipNumber(membershipNumber)
                .startDate(startDate)
                .endDate(endDate)
                .status("ACTIVE")
                .qrCodeToken(qrCodeToken)
                .autoRenew(false)
                .build();

        newMembership = membershipRepository.save(newMembership);

        // Record upgrade transaction
        String txRef = "TXN-UPG-" + System.currentTimeMillis();
        MembershipTransaction transaction = MembershipTransaction.builder()
                .membership(newMembership)
                .member(member)
                .transactionType("UPGRADE")
                .amount(newPlan.getPrice())
                .paymentMethod(req.getPaymentMethod().toUpperCase())
                .paymentStatus("PAID")
                .transactionReference(txRef)
                .paidAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        // Notify member
        if (member.getUser() != null) {
            notificationService.createNotification(
                    member.getUser().getId(),
                    "Membership Upgraded to " + newPlan.getName() + "!",
                    "Congratulations! Your tier has been upgraded to " + newPlan.getName() + " with expanded club benefits.",
                    "MEMBERSHIP"
            );
        }

        return mapToResponseDto(newMembership);
    }

    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getMyMemberships(Long userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found for user: " + userId));

        return membershipRepository.findByMemberOrderByCreatedAtDesc(member).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getAllMemberships() {
        checkAndMarkExpiredMemberships();
        return membershipRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MemberCardDto getQrMembershipCard(Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found: " + membershipId));

        Member member = membership.getMember();
        User user = member.getUser();

        // Encode safe token in QR code
        String qrPayload = "CLUBSPHERE:MEMBER:" + membership.getQrCodeToken();
        String qrCodeBase64 = QrCodeUtil.generateQrCodeBase64(qrPayload, 260, 260);

        return MemberCardDto.builder()
                .clubName("ClubSphere Sports Club")
                .memberName(user.getFullName())
                .memberCode(member.getMemberCode())
                .membershipNumber(membership.getMembershipNumber())
                .planCategory(membership.getPlan().getCategory())
                .planName(membership.getPlan().getName())
                .startDate(membership.getStartDate())
                .expiryDate(membership.getEndDate())
                .status(membership.getStatus())
                .qrCodeToken(membership.getQrCodeToken())
                .qrCodeBase64(qrCodeBase64)
                .bloodGroup(member.getBloodGroup())
                .emergencyPhone(member.getEmergencyContactPhone() != null ? member.getEmergencyContactPhone() : user.getPhone())
                .build();
    }

    @Transactional(readOnly = true)
    public MembershipDashboardStats getDashboardStats() {
        checkAndMarkExpiredMemberships();

        long totalMembers = memberRepository.count();
        long activeCount = membershipRepository.countByStatus("ACTIVE");
        long expiredCount = membershipRepository.countByStatus("EXPIRED");
        long pendingCount = membershipRepository.countByStatus("PENDING_PAYMENT");

        long goldCount = membershipRepository.countActiveByCategory("GOLD");
        long silverCount = membershipRepository.countActiveByCategory("SILVER");
        long juniorCount = membershipRepository.countActiveByCategory("JUNIOR");

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        BigDecimal monthlyRev = transactionRepository.sumRevenueBetween(startOfMonth, now);

        List<MembershipResponseDto> recents = membershipRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        return MembershipDashboardStats.builder()
                .totalMembers(totalMembers)
                .activeMembers(activeCount)
                .expiredMembers(expiredCount)
                .pendingPayments(pendingCount)
                .goldMembers(goldCount)
                .silverMembers(silverCount)
                .juniorMembers(juniorCount)
                .monthlyRevenue(monthlyRev)
                .recentMemberships(recents)
                .build();
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    @Transactional
    public void checkAndMarkExpiredMemberships() {
        List<Membership> expired = membershipRepository.findExpiredActiveMemberships(LocalDate.now());
        for (Membership m : expired) {
            m.setStatus("EXPIRED");
            membershipRepository.save(m);
        }
    }

    public MembershipResponseDto mapToResponseDto(Membership m) {
        boolean isExpired = m.getEndDate().isBefore(LocalDate.now());
        String currentStatus = isExpired ? "EXPIRED" : m.getStatus();

        return MembershipResponseDto.builder()
                .id(m.getId())
                .memberId(m.getMember().getId())
                .memberCode(m.getMember().getMemberCode())
                .memberName(m.getMember().getUser().getFullName())
                .memberEmail(m.getMember().getUser().getEmail())
                .planId(m.getPlan().getId())
                .planName(m.getPlan().getName())
                .planCategory(m.getPlan().getCategory())
                .planPrice(m.getPlan().getPrice())
                .membershipNumber(m.getMembershipNumber())
                .startDate(m.getStartDate())
                .endDate(m.getEndDate())
                .status(currentStatus)
                .qrCodeToken(m.getQrCodeToken())
                .autoRenew(m.getAutoRenew())
                .createdAt(m.getCreatedAt())
                .isExpired(isExpired)
                .build();
    }
}
