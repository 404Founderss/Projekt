package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Értesítés entitás.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Melyik felhasználóhoz tartozik az értesítés.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


     // Értesítés típusa.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;


     // Cím.
    @Column(nullable = false, length = 200)
    private String title;


     // Üzenet.
    @Column(columnDefinition = "TEXT")
    private String message;


     // Kapcsolódó termék (opcionális).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;


     // Olvasva van-e.
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;


     // Létrehozás időpontja.
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
    }
}