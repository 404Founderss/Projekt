package com.founders404.backend.repository;

import com.founders404.backend.model.Notification;
import com.founders404.backend.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Értesítés repository.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // User összes értesítése időrendi sorrendben.
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);


     // User olvasatlan értesítései.
    List<Notification> findByUserIdAndIsReadFalse(Long userId);


     // Olvasatlan értesítések száma.
    long countByUserIdAndIsReadFalse(Long userId);


     // Értesítés keresése ID és user alapján (security check-hez).
    Notification findByIdAndUserId(Long id, Long userId);

    // Legutóbbi notifikáció egy adott termékhez és userhez
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.product.id = :productId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findRecentByUserIdAndProductIdAndType(
            @Param("userId") Long userId,
            @Param("productId") Long productId,
            @Param("type") NotificationType type
    );
}