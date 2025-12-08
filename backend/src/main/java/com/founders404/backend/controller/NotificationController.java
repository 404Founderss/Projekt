package com.founders404.backend.controller;

import com.founders404.backend.model.Notification;
import com.founders404.backend.model.User;
import com.founders404.backend.service.NotificationService;
import com.founders404.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Értesítés REST API.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    /**
     * Aktuális user összes értesítése.
     * GET /api/notifications
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Olvasatlan értesítések száma.
     * GET /api/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * Értesítés megjelölése olvasottként.
     * PUT /api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        // Security check: csak saját értesítést módosíthat
        notificationService.markAsRead(id, user.getId());

        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    /**
     * Összes értesítés megjelölése olvasottként.
     * PUT /api/notifications/mark-all-read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * Aktuális bejelentkezett user lekérése JWT token-ből.
     */
    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userService.findByUsername(username);
    }
}