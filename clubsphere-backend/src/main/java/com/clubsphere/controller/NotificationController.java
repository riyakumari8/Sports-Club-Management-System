package com.clubsphere.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.model.Notification;
import com.clubsphere.security.UserDetailsImpl;
import com.clubsphere.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Notifications", description = "Centralized notification and alert system across Admin, Staff, and Members")
public class NotificationController {

    private final NotificationService notificationService;
    private final com.clubsphere.task.ScheduledTasks scheduledTasks;

    @GetMapping
    @Operation(summary = "Get filtered notifications for logged-in user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(required = false) String search
    ) {
        if (userDetails == null) {
            return ResponseEntity.ok(ApiResponse.success("No active user", Map.of("notifications", List.of(), "unreadCount", 0)));
        }

        Boolean isRead = (unreadOnly != null && unreadOnly) ? false : null;
        List<Notification> list = notificationService.filterNotifications(userDetails.getId(), category, severity, isRead);

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            list = list.stream().filter(n ->
                    (n.getTitle() != null && n.getTitle().toLowerCase().contains(q)) ||
                    (n.getMessage() != null && n.getMessage().toLowerCase().contains(q)) ||
                    (n.getCategory() != null && n.getCategory().toLowerCase().contains(q))
            ).toList();
        }

        long unread = notificationService.getUnreadCount(userDetails.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("notifications", list);
        data.put("unreadCount", unread);
        data.put("totalCount", list.size());

        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", data));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null) {
            notificationService.markAllAsRead(userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Dismiss single notification")
    public ResponseEntity<ApiResponse<Void>> dismissNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails != null) {
            notificationService.dismissNotification(id, userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Notification dismissed", null));
    }

    @DeleteMapping("/clear-read")
    @Operation(summary = "Clear all read notifications for current user")
    public ResponseEntity<ApiResponse<Void>> clearRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null) {
            notificationService.clearReadNotifications(userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Read notifications cleared", null));
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin broadcasts notification to role or all members")
    public ResponseEntity<ApiResponse<Void>> broadcastNotification(
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(required = false, defaultValue = "GENERAL") String category,
            @RequestParam(required = false, defaultValue = "INFO") String severity,
            @RequestParam(required = false) String actionUrl
    ) {
        notificationService.notifyAdmins(title, message, "ANNOUNCEMENT", category, severity, "BROADCAST", null, actionUrl);
        return ResponseEntity.ok(ApiResponse.success("Notification broadcasted", null));
    }

    @PostMapping("/trigger-demo-expiry-check")
    @Operation(summary = "Manually trigger trial and membership expiry checks for live viva evaluation demo")
    public ResponseEntity<ApiResponse<String>> triggerDemoExpiryCheck() {
        String result = scheduledTasks.triggerDemoExpiryCheck();
        return ResponseEntity.ok(ApiResponse.success(result, result));
    }
}
