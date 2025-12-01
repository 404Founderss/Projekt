package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Warehouse entitás az EDR diagram alapján.
 * Raktárak kezelése multi-tenant környezetben (company-hoz kötött).
 * JPA (Hibernate) kezeli és az adatbázisban tárolódik.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(length = 50, unique = true)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    private Double capacity;

    @Column(name = "current_stock")
    private Double currentStock = 0.0;

    @Column(length = 50)
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "floor_plan_data", columnDefinition = "TEXT")
    private String floorPlanData;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
