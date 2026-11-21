package com.clubsphere.task;

import com.clubsphere.modules.membership.entity.Membership;
import com.clubsphere.modules.membership.repository.MembershipRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import com.clubsphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final NotificationService notificationService;

    /**
     * Daily automated check at 01:00 AM for trial and membership expiries.
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void runDailyAutomatedChecks() {
        log.info("Starting automated daily checks for trials and memberships...");
        processTrialExpiries();
        processMembershipExpiriesAndReminders();
        log.info("Automated daily checks completed.");
    }

    /**
     * Callable on-demand for live demonstration during viva / project presentation.
     */
    @Transactional
    public String triggerDemoExpiryCheck() {
        int trialsUpdated = processTrialExpiries();
        int membershipsUpdated = processMembershipExpiriesAndReminders();
        return String.format("Demo check completed: %d trial(s) evaluated/updated, %d membership record(s) processed.",
                trialsUpdated, membershipsUpdated);
    }

    @Transactional
    public int processTrialExpiries() {
        LocalDate today = LocalDate.now();
        List<User> activeTrialUsers = userRepository.findByTrialStatus("ACTIVE");
        int count = 0;

        for (User u : activeTrialUsers) {
            if (u.getTrialEndDate() != null && u.getTrialEndDate().isBefore(today)) {
                u.setTrialStatus("EXPIRED");
                userRepository.save(u);
                count++;

                // Notify student
                notificationService.createNotification(
                        u.getId(),
                        "ROLE_MEMBER",
                        "Free Trial Period Expired",
                        "Your 7-day complimentary trial has ended. Subscribe to a Gold, Silver, or Junior plan to continue reserving courts and enjoying club amenities.",
                        "TRIAL_EXPIRED",
                        "MEMBERSHIP",
                        "HIGH",
                        "User",
                        u.getId(),
                        "/membership"
                );

                // Notify admin for sales follow-up
                notificationService.notifyAdmins(
                        "Trial Expired: " + u.getFullName(),
                        String.format("Trial ended for %s (%s). Follow up for membership conversion.", u.getFullName(), u.getEmail()),
                        "TRIAL_EXPIRED",
                        "MEMBERSHIP",
                        "MEDIUM",
                        "User",
                        u.getId(),
                        "/admin/memberships"
                );
            }
        }
        return count;
    }

    @Transactional
    public int processMembershipExpiriesAndReminders() {
        LocalDate today = LocalDate.now();
        int processedCount = 0;

        // 1. Process actually expired active memberships
        List<Membership> expiredList = membershipRepository.findExpiredActiveMemberships(today);
        for (Membership m : expiredList) {
            m.setStatus("EXPIRED");
            membershipRepository.save(m);
            processedCount++;

            if (m.getMember() != null && m.getMember().getUser() != null) {
                Long uid = m.getMember().getUser().getId();
                notificationService.createNotification(
                        uid,
                        "ROLE_MEMBER",
                        "Membership Expired: " + m.getMembershipNumber(),
                        "Your sports club membership has expired. Renew today to reactivate your court booking privileges and member benefits.",
                        "MEMBERSHIP_EXPIRED",
                        "MEMBERSHIP",
                        "CRITICAL",
                        "Membership",
                        m.getId(),
                        "/membership"
                );
            }

            notificationService.notifyAdmins(
                    "Membership Expired: " + m.getMembershipNumber(),
                    String.format("Membership %s for %s expired on %s.",
                            m.getMembershipNumber(),
                            m.getMember() != null && m.getMember().getUser() != null ? m.getMember().getUser().getFullName() : "Member",
                            m.getEndDate()),
                    "MEMBERSHIP_EXPIRED",
                    "MEMBERSHIP",
                    "HIGH",
                    "Membership",
                    m.getId(),
                    "/admin/memberships"
            );
        }

        // 2. 7-Day Expiry Reminder
        List<Membership> in7Days = membershipRepository.findActiveExpiringOn(today.plusDays(7));
        for (Membership m : in7Days) {
            if (m.getMember() != null && m.getMember().getUser() != null) {
                notificationService.createNotification(
                        m.getMember().getUser().getId(),
                        "ROLE_MEMBER",
                        "Membership Renewal Reminder (7 Days Remaining)",
                        String.format("Your %s membership (%s) expires in 7 days on %s. Renew now to avoid any interruption in court bookings.",
                                m.getPlan() != null ? m.getPlan().getName() : "Club", m.getMembershipNumber(), m.getEndDate()),
                        "EXPIRY_REMINDER",
                        "MEMBERSHIP",
                        "MEDIUM",
                        "Membership",
                        m.getId(),
                        "/membership"
                );
                processedCount++;
            }
        }

        // 3. 3-Day Expiry Reminder
        List<Membership> in3Days = membershipRepository.findActiveExpiringOn(today.plusDays(3));
        for (Membership m : in3Days) {
            if (m.getMember() != null && m.getMember().getUser() != null) {
                notificationService.createNotification(
                        m.getMember().getUser().getId(),
                        "ROLE_MEMBER",
                        "Urgent: Membership Renewal Reminder (3 Days Remaining)",
                        String.format("Your membership (%s) expires in only 3 days. Click here to renew online instantly.", m.getMembershipNumber()),
                        "EXPIRY_REMINDER",
                        "MEMBERSHIP",
                        "HIGH",
                        "Membership",
                        m.getId(),
                        "/membership"
                );
                processedCount++;
            }
        }

        // 4. 1-Day Expiry Reminder
        List<Membership> tomorrow = membershipRepository.findActiveExpiringOn(today.plusDays(1));
        for (Membership m : tomorrow) {
            if (m.getMember() != null && m.getMember().getUser() != null) {
                notificationService.createNotification(
                        m.getMember().getUser().getId(),
                        "ROLE_MEMBER",
                        "Final Notice: Membership Expires Tomorrow!",
                        String.format("Your membership (%s) expires tomorrow on %s. Renew now to preserve your member benefits.",
                                m.getMembershipNumber(), m.getEndDate()),
                        "EXPIRY_REMINDER",
                        "MEMBERSHIP",
                        "CRITICAL",
                        "Membership",
                        m.getId(),
                        "/membership"
                );
                processedCount++;
            }
        }

        return processedCount;
    }
}
