package com.founders404.backend.controller;

import com.founders404.backend.dto.CreateProductRequest;
import com.founders404.backend.dto.ProductResponse;
import com.founders404.backend.dto.UpdateProductRequest;
import com.founders404.backend.model.Product;
import com.founders404.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.io.IOException;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Product entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Összes termék lekérése szűrési lehetőségekkel.
     * GET /api/products?companyId=1&active=true&search=laptop&categoryId=5&supplierId=3
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId) {

        List<Product> products;

        if (companyId != null && search != null && !search.isEmpty()) {
            // Keresés cég és név alapján
            if (active != null && active) {
                products = productService.searchActiveByName(companyId, search);
            } else {
                products = productService.searchByName(companyId, search);
            }
        } else if (companyId != null) {
            // Cég termékei
            if (active != null && active) {
                products = productService.findActiveByCompanyId(companyId);
            } else {
                products = productService.findByCompanyId(companyId);
            }
        } else if (categoryId != null) {
            // Kategória szerint
            products = productService.findByCategoryId(categoryId);
        } else if (supplierId != null) {
            // Beszállító szerint
            products = productService.findBySupplierId(supplierId);
        } else {
            // Minden termék
            products = productService.findAll();
        }

        List<ProductResponse> response = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Termék lekérése ID alapján.
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.findById(id);
            return ResponseEntity.ok(convertToResponse(product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék lekérése SKU alapján.
     * GET /api/products/sku/{sku}
     */
    @GetMapping("/sku/{sku}")
    public ResponseEntity<Object> getProductBySku(@PathVariable String sku) {
        try {
            Product product = productService.findBySku(sku);
            return ResponseEntity.ok(convertToResponse(product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék lekérése vonalkód alapján.
     * GET /api/products/barcode/{barcode}
     */
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Object> getProductByBarcode(@PathVariable String barcode) {
        try {
            Product product = productService.findByBarcode(barcode);
            return ResponseEntity.ok(convertToResponse(product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék lekérése QR kód alapján.
     * GET /api/products/qrcode/{qrCode}
     */
    @GetMapping("/qrcode/{qrCode}")
    public ResponseEntity<Object> getProductByQrCode(@PathVariable String qrCode) {
        try {
            Product product = productService.findByQrCode(qrCode);
            return ResponseEntity.ok(convertToResponse(product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Újrarendelésre váró termékek lekérése.
     * GET /api/products/reorder?companyId=1
     */
    @GetMapping("/reorder")
    public ResponseEntity<Object> getProductsNeedingReorder(
            @RequestParam(required = true) Long companyId) {
        try {
            List<Product> products = productService.findProductsNeedingReorder(companyId);
            List<ProductResponse> response = products.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Új termék létrehozása.
     * POST /api/products
     * Body: CreateProductRequest
     */
    @PostMapping
    public ResponseEntity<Object> createProduct(@Valid @RequestBody CreateProductRequest request) {
        try {
            Product product = new Product();
            product.setCompanyId(request.getCompanyId());
            product.setCategoryId(request.getCategoryId());
            product.setSupplierId(request.getSupplierId());
            product.setName(request.getName());
            product.setSku(request.getSku());
            product.setBarcode(request.getBarcode());
            product.setQrCode(request.getQrCode());
            product.setDescription(request.getDescription());
            product.setUnit(request.getUnit());
            product.setNetPurchasePrice(request.getNetPurchasePrice());
            product.setGrossPurchasePrice(request.getGrossPurchasePrice());
            product.setNetSellingPrice(request.getNetSellingPrice());
            product.setGrossSellingPrice(request.getGrossSellingPrice());
            product.setVatRate(request.getVatRate());
            product.setCurrency(request.getCurrency());
            product.setMinStockLevel(request.getMinStockLevel());
            product.setOptimalStockLevel(request.getOptimalStockLevel());
            product.setMaxStockLevel(request.getMaxStockLevel());
            product.setReorderPoint(request.getReorderPoint());
            product.setReorderQuantity(request.getReorderQuantity());
            product.setWeight(request.getWeight());
            product.setWidth(request.getWidth());
            product.setHeight(request.getHeight());
            product.setDepth(request.getDepth());
            product.setShelfLifeDays(request.getShelfLifeDays());
            product.setIsActive(true);
            product.setIsSerialized(request.getIsSerialized() != null ? request.getIsSerialized() : false);
            product.setNotes(request.getNotes());
            product.setImageUrl(request.getImageUrl());

            Product savedProduct = productService.create(product);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék frissítése.
     * PUT /api/products/{id}
     * Body: UpdateProductRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        try {
            Product productDetails = new Product();
            productDetails.setCategoryId(request.getCategoryId());
            productDetails.setSupplierId(request.getSupplierId());
            productDetails.setName(request.getName());
            productDetails.setSku(request.getSku());
            productDetails.setBarcode(request.getBarcode());
            productDetails.setQrCode(request.getQrCode());
            productDetails.setDescription(request.getDescription());
            productDetails.setUnit(request.getUnit());
            productDetails.setNetPurchasePrice(request.getNetPurchasePrice());
            productDetails.setGrossPurchasePrice(request.getGrossPurchasePrice());
            productDetails.setNetSellingPrice(request.getNetSellingPrice());
            productDetails.setGrossSellingPrice(request.getGrossSellingPrice());
            productDetails.setVatRate(request.getVatRate());
            productDetails.setCurrency(request.getCurrency());
            productDetails.setMinStockLevel(request.getMinStockLevel());
            productDetails.setOptimalStockLevel(request.getOptimalStockLevel());
            productDetails.setMaxStockLevel(request.getMaxStockLevel());
            productDetails.setReorderPoint(request.getReorderPoint());
            productDetails.setReorderQuantity(request.getReorderQuantity());
            productDetails.setWeight(request.getWeight());
            productDetails.setWidth(request.getWidth());
            productDetails.setHeight(request.getHeight());
            productDetails.setDepth(request.getDepth());
            productDetails.setShelfLifeDays(request.getShelfLifeDays());
            productDetails.setIsActive(request.getIsActive());
            productDetails.setIsSerialized(request.getIsSerialized());
            productDetails.setNotes(request.getNotes());
            productDetails.setImageUrl(request.getImageUrl());

            Product updatedProduct = productService.update(id, productDetails);

            return ResponseEntity.ok(convertToResponse(updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék deaktiválása (soft delete).
     * PATCH /api/products/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivateProduct(@PathVariable Long id) {
        try {
            productService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Product deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék törlése (hard delete).
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        try {
            productService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getProductQRCode(@PathVariable Long id) {
        try {
            Product product = productService.findById(id);

            byte[] qrBytes = null;

            // 1) Ha fájlként tárolod → megpróbáljuk betölteni
            if (product.getQrCode() != null && !product.getQrCode().isEmpty()) {
                Path qrPath = Paths.get(product.getQrCode());
                if (Files.exists(qrPath)) {
                    qrBytes = Files.readAllBytes(qrPath);
                }
            }

            // 2) Ha Base64-ben van tárolva → dekódoljuk
            if (qrBytes == null && product.getQrCode() != null) {
                try {
                    qrBytes = Base64.getDecoder().decode(product.getQrCode());
                } catch (IllegalArgumentException ignore) {
                    // Nem Base64, átugorjuk
                }
            }

            // 3) Ha nincs QR → generáljuk és mentjük
            if (qrBytes == null) {
                qrBytes = productService.regenerateQrAndReturnBytes(id);
            }

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(qrBytes);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    /**
     * Product entitás konvertálása ProductResponse DTO-vá.
     */
    private ProductResponse convertToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getCompanyId(),
                product.getCategoryId(),
                product.getSupplierId(),
                product.getName(),
                product.getSku(),
                product.getBarcode(),
                product.getQrCode(),
                product.getDescription(),
                product.getUnit(),
                product.getNetPurchasePrice(),
                product.getGrossPurchasePrice(),
                product.getNetSellingPrice(),
                product.getGrossSellingPrice(),
                product.getVatRate(),
                product.getCurrency(),
                product.getMinStockLevel(),
                product.getOptimalStockLevel(),
                product.getMaxStockLevel(),
                product.getReorderPoint(),
                product.getReorderQuantity(),
                product.getWeight(),
                product.getWidth(),
                product.getHeight(),
                product.getDepth(),
                product.getShelfLifeDays(),
                product.getIsActive(),
                product.getIsSerialized(),
                product.getNotes(),
                product.getImageUrl(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
