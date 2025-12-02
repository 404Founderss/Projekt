package com.founders404.backend.service;

import com.founders404.backend.model.Notification;
import com.founders404.backend.model.NotificationType;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.User;
import com.founders404.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Értesítés szolgáltatás.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Új értesítés létrehozása.
     */
    @Transactional
    public Notification createNotification(
            User user,
            NotificationType type,
            String title,
            String message,
            Product product
    ) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setProduct(product);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    /**
     * Egyszerűsített verzió termék nélkül.
     */
    @Transactional
    public Notification createNotification(
            User user,
            NotificationType type,
            String title,
            String message
    ) {
        return createNotification(user, type, title, message, null);
    }

    /**
     * Egy értesítés lekérése ID alapján.
     */
    public Notification getUserNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId);
        if (notification == null) {
            throw new RuntimeException("Notification not found or access denied");
        }
        return notification;
    }

    /**
     * User összes értesítése.
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * User olvasatlan értesítései.
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    /**
     * Olvasatlan értesítések száma.
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Értesítés megjelölése olvasottként.
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = getUserNotification(notificationId, userId);
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Összes értesítés megjelölése olvasottként.
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}