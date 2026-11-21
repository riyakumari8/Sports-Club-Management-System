package com.clubsphere.service;

import com.clubsphere.model.Notification;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import com.clubsphere.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> filterNotifications(Long userId, String category, String severity, Boolean isRead) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().filter(n -> {
            if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase(n.getCategory())) return false;
            if (severity != null && !severity.trim().isEmpty() && !severity.equalsIgnoreCase(n.getSeverity())) return false;
            if (isRead != null && !isRead.equals(n.getIsRead())) return false;
            return true;
        }).toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            n.setReadAt(OffsetDateTime.now());
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        OffsetDateTime now = OffsetDateTime.now();
        for (Notification n : list) {
            n.setIsRead(true);
            if (n.getReadAt() == null) {
                n.setReadAt(now);
            }
        }
        notificationRepository.saveAll(list);
    }

    @Transactional
    public boolean dismissNotification(Long notificationId, Long userId) {
        return notificationRepository.findById(notificationId).map(n -> {
            if (n.getUser() != null && n.getUser().getId().equals(userId)) {
                notificationRepository.delete(n);
                return true;
            }
            return false;
        }).orElse(false);
    }

    @Transactional
    public void clearReadNotifications(Long userId) {
        notificationRepository.deleteReadByUserId(userId);
    }

    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type) {
        return createNotification(userId, "ROLE_MEMBER", title, message, type, "SYSTEM", "INFO", null, null, null);
    }

    @Transactional
    public Notification createNotification(
            Long userId,
            String recipientRole,
            String title,
            String message,
            String type,
            String category,
            String severity,
            String relatedEntityType,
            Long relatedEntityId,
            String actionUrl
    ) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("Cannot create notification, user {} not found", userId);
            return null;
        }

        Notification notification = Notification.builder()
                .user(user)
                .recipientRole(recipientRole != null ? recipientRole : "ROLE_MEMBER")
                .title(title)
                .message(message)
                .type(type)
                .category(category != null ? category : "SYSTEM")
                .severity(severity != null ? severity : "INFO")
                .relatedEntityType(relatedEntityType)
                .relatedEntityId(relatedEntityId)
                .actionUrl(actionUrl)
                .isRead(false)
                .createdAt(OffsetDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAdmins(
            String title,
            String message,
            String type,
            String category,
            String severity,
            String relatedEntityType,
            Long relatedEntityId,
            String actionUrl
    ) {
        List<User> admins = userRepository.findByRoles_Name(ERole.ROLE_ADMIN);
        for (User admin : admins) {
            createNotification(admin.getId(), "ROLE_ADMIN", title, message, type, category, severity, relatedEntityType, relatedEntityId, actionUrl);
        }
    }
}
