package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Shelf entitás - polcok kezelése raktárakban.
 * Egy polc egy raktárhoz tartozik (ManyToOne) és tárolja a pozícióját,
 * dimenzióit és kapacitását.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shelves")
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    /**
     * Az alaprajzon lévő shape azonosítója (pl. "shape-1732714567890")
     * Ez összeköti a Konva shapes-ekkel.
     */
    @Column(name = "shape_id", length = 100)
    private String shapeId;

    /**
     * Elem típusa: 'shelf' (polc) vagy 'wall' (fal)
     */
    @Column(length = 20, nullable = false)
    private String type = "shelf";

    @Column(length = 50, nullable = false)
    private String code;

    @Column(length = 100)
    private String name;

    @Column(name = "position_x", nullable = false)
    private Double positionX;

    @Column(name = "position_y", nullable = false)
    private Double positionY;

    @Column(nullable = false)
    private Double width;

    @Column(nullable = false)
    private Double height;

    @Column
    private Double rotation = 0.0;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(name = "current_usage")
    private Integer currentUsage = 0;

    @Column(name = "capacity_unit", length = 50)
    private String capacityUnit;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentUsage == null) {
            currentUsage = 0;
        }
        if (rotation == null) {
            rotation = 0.0;
        }
        if (isActive == null) {
            isActive = true;
        }
        if (type == null) {
            type = "shelf";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Ellenőrzi, hogy a polc megtelt-e.
     */
    public boolean isFull() {
        return maxCapacity != null && currentUsage >= maxCapacity;
    }

    /**
     * Kiszámolja a kapacitás kihasználtságát százalékban.
     */
    public Double getUtilizationPercentage() {
        if (maxCapacity == null || maxCapacity == 0) {
            return 0.0;
        }
        return (currentUsage.doubleValue() / maxCapacity.doubleValue()) * 100.0;
    }

    /**
     * Visszaadja a fennmaradó kapacitást.
     */
    public Integer getRemainingCapacity() {
        if (maxCapacity == null) {
            return null;
        }
        return maxCapacity - currentUsage;
    }
}
