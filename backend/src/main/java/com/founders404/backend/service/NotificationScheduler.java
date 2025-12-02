package com.founders404.backend.service;

import com.founders404.backend.model.NotificationType;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.User;
import com.founders404.backend.repository.ProductRepository;
import com.founders404.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    /**
     * Alacsony készlet ellenőrzés.
     * Futtatás: óránként (3600000 ms = 1 óra)
     * Vagy napi egyszer: cron = "0 0 9 * * ?" (minden nap reggel 9-kor)
     */
    @Scheduled(fixedRate = 3600000) // 1 óránként
    // @Scheduled(cron = "0 0 9 * * ?") // Naponta 9:00-kor
    public void checkLowStock() {
        System.out.println("Running scheduled task: checkLowStock");

        // Összes aktív termék lekérése
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            // Ha van minStockLevel beállítva és elérte vagy alatta van
            if (product.getMinStockLevel() != null
                    && product.getCurrentStock() != null
                    && product.getCurrentStock() <= product.getMinStockLevel()) {

                // Cégen belüli összes user értesítése (vagy csak admin/owner)
                List<User> usersToNotify = getUsersToNotify(product.getCompanyId());

                for (User user : usersToNotify) {
                    // Ellenőrizzük, hogy még nem küldetünk-e már értesítést
                    // (Opcionális: duplikáció ellenőrzés)

                    String title = product.getCurrentStock() == 0
                            ? "Készlet kifogyott!"
                            : "Alacsony készlet!";

                    String message = String.format(
                            "A(z) '%s' (SKU: %s) termék készlete alacsony! Jelenlegi: %d, Minimum: %d",
                            product.getName(),
                            product.getSku(),
                            product.getCurrentStock(),
                            product.getMinStockLevel()
                    );

                    NotificationType type = product.getCurrentStock() == 0
                            ? NotificationType.STOCK_OUT
                            : NotificationType.LOW_STOCK;

                    notificationService.createNotification(
                            user,
                            type,
                            title,
                            message,
                            product
                    );
                }
            }
        }
    }

    /**
     * Cégen belüli értesítendő userek lekérése.
     * Jelenleg: minden user a cégnél
     * Opcionális: csak OWNER és CLERK role-ok
     */
    private List<User> getUsersToNotify(Long companyId) {
        if (companyId == null) {
            // Ha nincs cég (régi adatok), akkor üres lista
            return List.of();
        }

        // Összes user a cégnél
        return userRepository.findByCompanyId(companyId);

        // Vagy csak bizonyos role-ok:
        // return userRepository.findByCompanyId(companyId).stream()
        //     .filter(u -> u.getRole() == Role.OWNER || u.getRole() == Role.CLERK)
        //     .toList();
    }
}