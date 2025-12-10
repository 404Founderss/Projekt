package com.founders404.backend.service;

import com.founders404.backend.model.Notification;
import com.founders404.backend.model.NotificationType;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.User;
import com.founders404.backend.repository.NotificationRepository;
import com.founders404.backend.repository.ProductRepository;
import com.founders404.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Ütemezett feladatok - Értesítések automatikus küldése.
 */
@Service
@RequiredArgsConstructor
public class NotificationScheduler {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    /**
     * Alacsony készlet ellenőrzés.
     * Futtatás: percenként (60000 ms = 1 perc)
     * Küszöbérték: 10 egység alatt
     * Duplikációs ellenőrzés: csak akkor hoz létre notifikációt, ha az elmúlt 30 percben nem volt
     */
    @Scheduled(fixedRate = 60000) // percenként
    public void checkLowStock() {
        System.out.println("=== Running scheduled task: checkLowStock at " + LocalDateTime.now() + " ===");

        try {
            // Összes aktív termék lekérése
            List<Product> products = productRepository.findAll();
            System.out.println("Found " + products.size() + " total products to check");

            // Filter only products with low stock
            List<Product> lowStockProducts = products.stream()
                    .filter(p -> p.getCurrentStock() != null && p.getCurrentStock() < 10)
                    .toList();
            System.out.println("Found " + lowStockProducts.size() + " products with low stock (<10 units)");

            int notificationsCreated = 0;

            for (Product product : lowStockProducts) {
                System.out.println("Processing low-stock product: '" + product.getName() + "' (Stock: " + 
                                 product.getCurrentStock() + ", CompanyId: " + product.getCompanyId() + ")");

                // Cégen belüli összes user értesítése
                List<User> usersToNotify = getUsersToNotify(product.getCompanyId());
                System.out.println("  -> Found " + usersToNotify.size() + " users to notify for company: " + product.getCompanyId());

                if (usersToNotify.isEmpty() && product.getCompanyId() != null) {
                    System.out.println("  -> WARNING: No users found for company " + product.getCompanyId());
                }

                for (User user : usersToNotify) {
                    try {
                        // Duplikáció ellenőrzés: volt-e már notifikáció az elmúlt 30 percben erre a termékhöz?
                        LocalDateTime thirtyMinutesAgo = LocalDateTime.now().minusMinutes(30);
                        List<Notification> recentNotifications = notificationRepository
                                .findRecentByUserIdAndProductIdAndType(
                                        user.getId(),
                                        product.getId(),
                                        NotificationType.LOW_STOCK
                                );

                        boolean recentNotificationExists = recentNotifications.stream()
                                .anyMatch(n -> n.getCreatedAt().isAfter(thirtyMinutesAgo));

                        if (!recentNotificationExists) {
                            // Alacsony készlet jellegzetesség
                            String title = "Alacsony készlet!";

                            String message = String.format(
                                    "A(z) '%s' termék készlete alacsony! Jelenlegi: %d",
                                    product.getName(),
                                    product.getCurrentStock()
                            );

                            Notification createdNotification = notificationService.createNotification(
                                    user,
                                    NotificationType.LOW_STOCK,
                                    title,
                                    message,
                                    product
                            );
                            notificationsCreated++;
                            System.out.println("     -> Created notification ID: " + createdNotification.getId() + " for user: " + user.getUsername());
                        } else {
                            System.out.println("     -> Skipped (recent notification exists for user: " + user.getUsername() + ")");
                        }
                    } catch (Exception e) {
                        System.err.println("Error creating notification for user " + user.getUsername() + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
            System.out.println("=== Completed checkLowStock: " + notificationsCreated + " notifications created ===\n");
        } catch (Exception e) {
            System.err.println("Fatal error in checkLowStock scheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Cégen belüli értesítendő userek lekérése.
     * Jelenleg: minden user a cégnél
     * Opcionális: csak OWNER és CLERK role-ok
     */
    private List<User> getUsersToNotify(Long companyId) {
        try {
            if (companyId == null) {
                System.out.println("WARNING: Product has null companyId - no users to notify!");
                return List.of();
            }

            // Összes user a cégnél
            List<User> users = userRepository.findByCompanyId(companyId);
            System.out.println("  -> Company " + companyId + " has " + users.size() + " users");
            
            return users;

            // Vagy csak bizonyos role-ok:
            // return userRepository.findByCompanyId(companyId).stream()
            //     .filter(u -> u.getRole() == Role.OWNER || u.getRole() == Role.CLERK)
            //     .toList();
        } catch (Exception e) {
            System.err.println("Error getting users for company " + companyId + ": " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
}