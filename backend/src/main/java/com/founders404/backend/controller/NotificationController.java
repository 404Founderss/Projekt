package com.founders404.backend.controller;

import com.founders404.backend.model.Notification;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.User;
import com.founders404.backend.repository.ProductRepository;
import com.founders404.backend.service.NotificationService;
import com.founders404.backend.service.NotificationScheduler;
import com.founders404.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Értesítés REST API.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final NotificationScheduler notificationScheduler;
    private final ProductRepository productRepository;

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
     * Aktuális user olvasatlan értesítései.
     * GET /api/notifications/unread
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Notification> unreadNotifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(unreadNotifications);
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
     * DEBUG: Scheduler diagnosztika - teszteléshez
     * GET /api/notifications/debug/scheduler-status
     */
    @GetMapping("/debug/scheduler-status")
    public ResponseEntity<Map<String, Object>> getSchedulerStatus(Authentication authentication) {
        User user = getCurrentUser(authentication);
        Map<String, Object> debugInfo = new HashMap<>();

        // Összes termék
        List<Product> allProducts = productRepository.findAll();
        debugInfo.put("totalProducts", allProducts.size());

        // Alacsony készlet termékek
        List<Product> lowStockProducts = allProducts.stream()
                .filter(p -> p.getCurrentStock() != null && p.getCurrentStock() < 10)
                .collect(Collectors.toList());
        debugInfo.put("lowStockProductsCount", lowStockProducts.size());

        // Alacsony készlet termékek részletes listája
        List<Map<String, Object>> lowStockDetails = lowStockProducts.stream()
                .map(p -> {
                    Map<String, Object> detail = new HashMap<>();
                    detail.put("productId", p.getId());
                    detail.put("productName", p.getName());
                    detail.put("currentStock", p.getCurrentStock());
                    detail.put("companyId", p.getCompanyId());
                    return detail;
                })
                .collect(Collectors.toList());
        debugInfo.put("lowStockProducts", lowStockDetails);

        // Aktuális user értesítései
        List<Notification> userNotifications = notificationService.getUserNotifications(user.getId());
        debugInfo.put("userNotificationsCount", userNotifications.size());

        // Összes értesítés az adatbázisban
        debugInfo.put("message", "Run /api/notifications/debug/run-scheduler to trigger scheduler now");

        return ResponseEntity.ok(debugInfo);
    }

    /**
     * DEBUG: Scheduler manuális futtatás - teszteléshez
     * POST /api/notifications/debug/run-scheduler
     */
    @PostMapping("/debug/run-scheduler")
    public ResponseEntity<Map<String, String>> runSchedulerManually(Authentication authentication) {
        User user = getCurrentUser(authentication);
        System.out.println("\n!!! MANUAL SCHEDULER RUN TRIGGERED BY " + user.getUsername() + " !!!");
        
        notificationScheduler.checkLowStock();
        
        return ResponseEntity.ok(Map.of("message", "Scheduler ran manually. Check backend console logs for details."));
    }

    /**
     * Aktuális bejelentkezett user lekérése JWT token-ből.
     */
    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userService.findByUsername(username);
    }
}