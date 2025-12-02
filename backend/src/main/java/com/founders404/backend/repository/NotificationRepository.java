package com.founders404.backend.repository;

import com.founders404.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}