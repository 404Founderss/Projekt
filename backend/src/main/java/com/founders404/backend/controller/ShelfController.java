package com.founders404.backend.controller;

import com.founders404.backend.dto.CreateShelfRequest;
import com.founders404.backend.dto.ProductResponse;
import com.founders404.backend.dto.ShelfResponse;
import com.founders404.backend.dto.UpdateShelfRequest;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.Shelf;
import com.founders404.backend.service.ProductService;
import com.founders404.backend.service.CategoryService;
import com.founders404.backend.service.ShelfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpoints for Shelf entity management.
 * Managing shelves and walls (floor plan elements) in warehouses.
 */
@RestController
@RequestMapping("/api/shelves")
@RequiredArgsConstructor
public class ShelfController {

    private final ShelfService shelfService;
    private final ProductService productService;
    private final CategoryService categoryService;

    /**
     * Get all shelves with filtering options.
     * GET /api/shelves?warehouseId=1&type=shelf&active=true
     */
    @GetMapping
    public ResponseEntity<List<ShelfResponse>> getAllShelves(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean active) {

        List<Shelf> shelves;

        if (warehouseId != null && type != null) {
            shelves = shelfService.findByWarehouseIdAndType(warehouseId, type);
        } else if (warehouseId != null && active != null && active) {
            shelves = shelfService.findActiveByWarehouseId(warehouseId);
        } else if (warehouseId != null) {
            shelves = shelfService.findByWarehouseId(warehouseId);
        } else {
            shelves = shelfService.findAll();
        }

        List<ShelfResponse> response = shelves.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Get shelf by ID.
     * GET /api/shelves/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getShelfById(@PathVariable Long id) {
        try {
            Shelf shelf = shelfService.findById(id);
            return ResponseEntity.ok(convertToResponse(shelf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Find shelf by code.
     * GET /api/shelves/code/{code}
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Object> getShelfByCode(@PathVariable String code) {
        try {
            Shelf shelf = shelfService.findByCode(code);
            return ResponseEntity.ok(convertToResponse(shelf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Find shelf by shape ID (Konva integration).
     * GET /api/shelves/shape/{shapeId}
     */
    @GetMapping("/shape/{shapeId}")
    public ResponseEntity<Object> getShelfByShapeId(@PathVariable String shapeId) {
        try {
            Shelf shelf = shelfService.findByShapeId(shapeId);
            return ResponseEntity.ok(convertToResponse(shelf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Create new shelf/wall.
     * POST /api/shelves
     * Body: CreateShelfRequest
     */
    @PostMapping
    public ResponseEntity<Object> createShelf(@Valid @RequestBody CreateShelfRequest request) {
        try {
            Shelf shelf = new Shelf();
            shelf.setWarehouseId(request.getWarehouseId());
            shelf.setShapeId(request.getShapeId());
            shelf.setType(request.getType());
            shelf.setCode(request.getCode());
            shelf.setName(request.getName());
            shelf.setPositionX(request.getPositionX());
            shelf.setPositionY(request.getPositionY());
            shelf.setWidth(request.getWidth());
            shelf.setHeight(request.getHeight());
            shelf.setRotation(request.getRotation() != null ? request.getRotation() : 0.0);
            shelf.setMaxCapacity(request.getMaxCapacity());
            shelf.setCapacityUnit(request.getCapacityUnit());
            shelf.setNotes(request.getNotes());
            shelf.setIsActive(true);

            Shelf savedShelf = shelfService.create(shelf);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedShelf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Batch create - e.g. when saving floor plan.
     * POST /api/shelves/batch
     * Body: List<CreateShelfRequest>
     */
    @PostMapping("/batch")
    public ResponseEntity<Object> createShelfBatch(@Valid @RequestBody List<CreateShelfRequest> requests) {
        try {
            List<Shelf> shelves = requests.stream().map(request -> {
                Shelf shelf = new Shelf();
                shelf.setWarehouseId(request.getWarehouseId());
                shelf.setShapeId(request.getShapeId());
                shelf.setType(request.getType());
                shelf.setCode(request.getCode());
                shelf.setName(request.getName());
                shelf.setPositionX(request.getPositionX());
                shelf.setPositionY(request.getPositionY());
                shelf.setWidth(request.getWidth());
                shelf.setHeight(request.getHeight());
                shelf.setRotation(request.getRotation() != null ? request.getRotation() : 0.0);
                shelf.setMaxCapacity(request.getMaxCapacity());
                shelf.setCapacityUnit(request.getCapacityUnit());
                shelf.setNotes(request.getNotes());
                shelf.setIsActive(true);
                return shelf;
            }).collect(Collectors.toList());

            List<Shelf> savedShelves = shelfService.createBatch(shelves);

            List<ShelfResponse> response = savedShelves.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update shelf.
     * PUT /api/shelves/{id}
     * Body: UpdateShelfRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateShelf(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShelfRequest request) {
        try {
            Shelf shelfDetails = new Shelf();
            shelfDetails.setShapeId(request.getShapeId());
            shelfDetails.setType(request.getType());
            shelfDetails.setCode(request.getCode());
            shelfDetails.setName(request.getName());
            shelfDetails.setPositionX(request.getPositionX());
            shelfDetails.setPositionY(request.getPositionY());
            shelfDetails.setWidth(request.getWidth());
            shelfDetails.setHeight(request.getHeight());
            shelfDetails.setRotation(request.getRotation());
            shelfDetails.setMaxCapacity(request.getMaxCapacity());
            shelfDetails.setCurrentUsage(request.getCurrentUsage());
            shelfDetails.setCapacityUnit(request.getCapacityUnit());
            shelfDetails.setIsActive(request.getIsActive());
            shelfDetails.setNotes(request.getNotes());

            Shelf updatedShelf = shelfService.update(id, shelfDetails);

            return ResponseEntity.ok(convertToResponse(updatedShelf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Deactivate shelf (soft delete).
     * PATCH /api/shelves/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivateShelf(@PathVariable Long id) {
        try {
            shelfService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Shelf deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete shelf (hard delete).
     * DELETE /api/shelves/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteShelf(@PathVariable Long id) {
        try {
            shelfService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Shelf deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all products on a specific shelf.
     * GET /api/shelves/{id}/products
     */
    @GetMapping("/{id}/products")
    public ResponseEntity<Object> getShelfProducts(@PathVariable Long id) {
        try {
            Shelf shelf = shelfService.findById(id);
            List<Product> products = productService.findByShelfId(id);
            
            List<ProductResponse> response = products.stream()
                    .map(this::convertProductToResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete all shelves/walls in a warehouse.
     * DELETE /api/shelves/warehouse/{warehouseId}
     */
    @DeleteMapping("/warehouse/{warehouseId}")
    public ResponseEntity<Object> deleteAllShelvesInWarehouse(@PathVariable Long warehouseId) {
        try {
            shelfService.deleteAllByWarehouseId(warehouseId);
            return ResponseEntity.ok(Map.of("message", "All shelves in warehouse deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Convert Product entity to ProductResponse DTO.
     */
    private ProductResponse convertProductToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setCompanyId(product.getCompanyId());
        response.setCategoryId(product.getCategoryId());
        if (product.getCategoryId() != null) {
            try {
                response.setCategoryName(categoryService.findById(product.getCategoryId()).getName());
            } catch (Exception e) {
                response.setCategoryName(null);
            }
        }
        response.setSupplierId(product.getSupplierId());
        response.setShelfId(product.getShelfId());
        response.setName(product.getName());
        response.setSku(product.getSku());
        response.setBarcode(product.getBarcode());
        response.setQrCode(product.getQrCode());
        response.setDescription(product.getDescription());
        response.setUnit(product.getUnit());
        response.setNetPurchasePrice(product.getNetPurchasePrice());
        response.setGrossPurchasePrice(product.getGrossPurchasePrice());
        response.setNetSellingPrice(product.getNetSellingPrice());
        response.setGrossSellingPrice(product.getGrossSellingPrice());
        response.setVatRate(product.getVatRate());
        response.setCurrency(product.getCurrency());
        response.setCurrentStock(product.getCurrentStock());
        response.setStatus((product.getCurrentStock() != null && product.getCurrentStock() > 0) ? "Available" : "Reserved");
        response.setMinStockLevel(product.getMinStockLevel());
        response.setOptimalStockLevel(product.getOptimalStockLevel());
        response.setMaxStockLevel(product.getMaxStockLevel());
        response.setReorderPoint(product.getReorderPoint());
        response.setReorderQuantity(product.getReorderQuantity());
        response.setWeight(product.getWeight());
        response.setWidth(product.getWidth());
        response.setHeight(product.getHeight());
        response.setDepth(product.getDepth());
        response.setShelfLifeDays(product.getShelfLifeDays());
        response.setIsActive(product.getIsActive());
        response.setIsSerialized(product.getIsSerialized());
        response.setNotes(product.getNotes());
        response.setImageUrl(product.getImageUrl());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    /**
     * Convert Shelf entity to ShelfResponse DTO.
     */
    private ShelfResponse convertToResponse(Shelf shelf) {
        ShelfResponse response = new ShelfResponse();
        response.setId(shelf.getId());
        response.setWarehouseId(shelf.getWarehouseId());
        response.setShapeId(shelf.getShapeId());
        response.setType(shelf.getType());
        response.setCode(shelf.getCode());
        response.setName(shelf.getName());
        response.setPositionX(shelf.getPositionX());
        response.setPositionY(shelf.getPositionY());
        response.setWidth(shelf.getWidth());
        response.setHeight(shelf.getHeight());
        response.setRotation(shelf.getRotation());
        response.setMaxCapacity(shelf.getMaxCapacity());
        response.setCurrentUsage(shelf.getCurrentUsage());
        response.setCapacityUnit(shelf.getCapacityUnit());
        response.setIsActive(shelf.getIsActive());
        response.setNotes(shelf.getNotes());
        response.setCreatedAt(shelf.getCreatedAt());
        response.setUpdatedAt(shelf.getUpdatedAt());

        // Calculated fields
        response.setUtilizationPercentage(shelf.getUtilizationPercentage());
        response.setRemainingCapacity(shelf.getRemainingCapacity());

        return response;
    }
}
