package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Product entitás az EDR diagram alapján.
 * JPA (Hibernate) kezeli és az adatbázisban tárolódik.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class
Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100)
    private String sku;

    @Column(length = 100)
    private String barcode;

    @Column(name = "qr_code", length = 255)
    private String qrCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String unit;

    @Column(name = "net_purchase_price", precision = 12, scale = 2)
    private BigDecimal netPurchasePrice;

    @Column(name = "gross_purchase_price", precision = 12, scale = 2)
    private BigDecimal grossPurchasePrice;

    @Column(name = "net_selling_price", precision = 12, scale = 2)
    private BigDecimal netSellingPrice;

    @Column(name = "gross_selling_price", precision = 12, scale = 2)
    private BigDecimal grossSellingPrice;

    @Column(name = "vat_rate", precision = 5, scale = 2)
    private BigDecimal vatRate;

    @Column(length = 3)
    private String currency;

    @Column(name = "min_stock_level")
    private Integer minStockLevel;

    @Column(name = "optimal_stock_level")
    private Integer optimalStockLevel;

    @Column(name = "max_stock_level")
    private Integer maxStockLevel;

    @Column(name = "reorder_point")
    private Integer reorderPoint;

    @Column(name = "reorder_quantity")
    private Integer reorderQuantity;

    @Column(precision = 10, scale = 3)
    private BigDecimal weight;

    @Column(precision = 10, scale = 2)
    private BigDecimal width;

    @Column(precision = 10, scale = 2)
    private BigDecimal height;

    @Column(precision = 10, scale = 2)
    private BigDecimal depth;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_serialized")
    private Boolean isSerialized = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
