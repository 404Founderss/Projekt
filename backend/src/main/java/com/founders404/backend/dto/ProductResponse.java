package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private Long companyId;
    private Long categoryId;
    private Long supplierId;
    private String name;
    private String sku;
    private String barcode;
    private String qrCode;
    private String description;
    private String unit;
    private BigDecimal netPurchasePrice;
    private BigDecimal grossPurchasePrice;
    private BigDecimal netSellingPrice;
    private BigDecimal grossSellingPrice;
    private BigDecimal vatRate;
    private String currency;
    private Integer minStockLevel;
    private Integer optimalStockLevel;
    private Integer maxStockLevel;
    private Integer reorderPoint;
    private Integer reorderQuantity;
    private BigDecimal weight;
    private BigDecimal width;
    private BigDecimal height;
    private BigDecimal depth;
    private Integer shelfLifeDays;
    private Boolean isActive;
    private Boolean isSerialized;
    private String notes;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
