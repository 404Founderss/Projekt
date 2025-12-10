package com.founders404.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private Long categoryId;

    private Long supplierId;

    private Long shelfId;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @Size(max = 100, message = "SKU must not exceed 100 characters")
    private String sku;

    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    private String barcode;

    @Size(max = 255, message = "QR code must not exceed 255 characters")
    private String qrCode;

    private String description;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    private String unit;

    @Min(value = 0, message = "Current stock must be non-negative")
    private Integer currentStock;

    @DecimalMin(value = "0.0", inclusive = true, message = "Net purchase price must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal netPurchasePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Gross purchase price must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal grossPurchasePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Net selling price must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal netSellingPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Gross selling price must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal grossSellingPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "VAT rate must be positive")
    @DecimalMax(value = "100.0", inclusive = true, message = "VAT rate must not exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Invalid VAT rate format")
    private BigDecimal vatRate;

    @Size(max = 3, message = "Currency must be 3 characters (e.g., HUF, EUR, USD)")
    private String currency;

    @Min(value = 0, message = "Min stock level must be positive")
    private Integer minStockLevel;

    @Min(value = 0, message = "Optimal stock level must be positive")
    private Integer optimalStockLevel;

    @Min(value = 0, message = "Max stock level must be positive")
    private Integer maxStockLevel;

    @Min(value = 0, message = "Reorder point must be positive")
    private Integer reorderPoint;

    @Min(value = 0, message = "Reorder quantity must be positive")
    private Integer reorderQuantity;

    @DecimalMin(value = "0.0", inclusive = true, message = "Weight must be positive")
    private BigDecimal weight;

    @DecimalMin(value = "0.0", inclusive = true, message = "Width must be positive")
    private BigDecimal width;

    @DecimalMin(value = "0.0", inclusive = true, message = "Height must be positive")
    private BigDecimal height;

    @DecimalMin(value = "0.0", inclusive = true, message = "Depth must be positive")
    private BigDecimal depth;

    @Min(value = 0, message = "Shelf life days must be positive")
    private Integer shelfLifeDays;

    private Boolean isSerialized;

    private String notes;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;
}
