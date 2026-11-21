package com.clubsphere.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.model.Notification;
import com.clubsphere.security.UserDetailsImpl;
import com.clubsphere.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Notifications", description = "In-app centralized notifications for users")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get all notifications for logged-in user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.ok(ApiResponse.success("No active user", Map.of("notifications", List.of(), "unreadCount", 0)));
        }

        List<Notification> list = notificationService.getNotificationsForUser(userDetails.getId());
        long unread = notificationService.getUnreadCount(userDetails.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("notifications", list);
        data.put("unreadCount", unread);

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
}
