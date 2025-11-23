package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Készletmozgás entitás. (IN/OUT/ADJUSTMENT/SCRAP rögz.).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inventory_movements")
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //termék
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    //mozgás
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private MovementType movementType;

    //mennyiség
    @Column(nullable = false)
    private Integer quantity;

    //indoklás
    @Column(length = 100)
    private String reason;

    //végrehajtó
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //mikor történt
    @Column(nullable = false)
    private LocalDateTime timestamp;

    //megjegyzés
    @Column(columnDefinition = "TEXT")
    private String notes;

    //előző stock
    @Column(name = "previous_stock")
    private Integer previousStock;

    //új stock
    @Column(name = "new_stock")
    private Integer newStock;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        createdAt = LocalDateTime.now();
    }
}
