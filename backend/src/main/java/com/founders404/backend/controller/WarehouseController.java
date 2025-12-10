package com.founders404.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.founders404.backend.dto.CreateWarehouseRequest;
import com.founders404.backend.dto.ShelfResponse;
import com.founders404.backend.dto.UpdateWarehouseRequest;
import com.founders404.backend.dto.WarehouseResponse;
import com.founders404.backend.model.Shelf;
import com.founders404.backend.model.Warehouse;
import com.founders404.backend.repository.ShelfRepository;
import com.founders404.backend.service.ShelfService;
import com.founders404.backend.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Warehouse entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;
    private final ShelfService shelfService;
    private final ObjectMapper objectMapper;
    private final ShelfRepository shelfRepository;

    /**
     * Összes raktár lekérése szűrési lehetőségekkel.
     * GET /api/warehouses?companyId=1&active=true&search=central&city=Budapest
     */
    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> getAllWarehouses(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long managerId) {

        List<Warehouse> warehouses;

        if (companyId != null) {
            if (search != null && !search.isEmpty()) {
                // Keresés név alapján cég szűréssel
                if (active != null && active) {
                    warehouses = warehouseService.searchActiveByName(companyId, search);
                } else {
                    warehouses = warehouseService.searchByName(companyId, search);
                }
            } else if (city != null && !city.isEmpty()) {
                // Város szerint szűrés
                warehouses = warehouseService.findByCity(companyId, city);
            } else if (active != null && active) {
                // Csak aktívak
                warehouses = warehouseService.findActiveByCompanyId(companyId);
            } else {
                // Cég összes raktára
                warehouses = warehouseService.findByCompanyId(companyId);
            }
        } else if (managerId != null) {
            // Vezető szerint szűrés
            warehouses = warehouseService.findByManagerId(managerId);
        } else {
            // Minden raktár
            warehouses = warehouseService.findAll();
        }

        List<WarehouseResponse> response = warehouses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Raktár lekérése ID alapján.
     * GET /api/warehouses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getWarehouseById(@PathVariable Long id) {
        try {
            Warehouse warehouse = warehouseService.findById(id);
            return ResponseEntity.ok(convertToResponse(warehouse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Raktár lekérése kód alapján.
     * GET /api/warehouses/code/{code}
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Object> getWarehouseByCode(@PathVariable String code) {
        try {
            Warehouse warehouse = warehouseService.findByCode(code);
            return ResponseEntity.ok(convertToResponse(warehouse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Új raktár létrehozása.
     * POST /api/warehouses
     * Body: CreateWarehouseRequest
     */
    @PostMapping
    public ResponseEntity<Object> createWarehouse(@Valid @RequestBody CreateWarehouseRequest request) {
        try {
            Warehouse warehouse = new Warehouse();
            warehouse.setCompanyId(request.getCompanyId());
            warehouse.setName(request.getName());
            warehouse.setCode(request.getCode());
            warehouse.setAddress(request.getAddress());
            warehouse.setCity(request.getCity());
            warehouse.setPostalCode(request.getPostalCode());
            warehouse.setCountry(request.getCountry());
            warehouse.setEmail(request.getEmail());
            warehouse.setPhone(request.getPhone());
            warehouse.setManagerId(request.getManagerId());
            warehouse.setIsActive(true);
            warehouse.setCapacity(request.getCapacity());
            warehouse.setUnit(request.getUnit());
            warehouse.setDescription(request.getDescription());
            warehouse.setFloorPlanData(request.getFloorPlanData());

            Warehouse savedWarehouse = warehouseService.create(warehouse);

            // Parse floor plan data and create shelf records
            if (request.getFloorPlanData() != null && !request.getFloorPlanData().isEmpty()) {
                try {
                    JsonNode rootNode = objectMapper.readTree(request.getFloorPlanData());
                    JsonNode shapesArray = rootNode.isArray() ? rootNode : rootNode.get("shapes");
                    
                    if (shapesArray != null && shapesArray.isArray()) {
                        int shelfCounter = 1;
                        for (JsonNode shapeNode : shapesArray) {
                            String type = shapeNode.has("type") ? shapeNode.get("type").asText() : "";
                            
                            if ("shelf".equals(type)) {
                                Shelf shelf = new Shelf();
                                shelf.setWarehouseId(savedWarehouse.getId());
                                shelf.setShapeId(shapeNode.has("id") ? shapeNode.get("id").asText() : null);
                                shelf.setType("shelf");
                                shelf.setCode("SHELF-" + savedWarehouse.getCode() + "-" + shelfCounter);
                                shelf.setName("Shelf " + shelfCounter);
                                shelf.setPositionX(shapeNode.has("x") ? shapeNode.get("x").asDouble() : 0.0);
                                shelf.setPositionY(shapeNode.has("y") ? shapeNode.get("y").asDouble() : 0.0);
                                shelf.setWidth(shapeNode.has("width") ? shapeNode.get("width").asDouble() : 120.0);
                                shelf.setHeight(shapeNode.has("height") ? shapeNode.get("height").asDouble() : 40.0);
                                shelf.setRotation(shapeNode.has("rotation") ? shapeNode.get("rotation").asDouble() : 0.0);
                                shelf.setMaxCapacity(1000);
                                shelf.setCapacityUnit("pcs");
                                shelf.setIsActive(true);
                                
                                shelfService.create(shelf);
                                shelfCounter++;
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Failed to parse floor plan data and create shelves: " + e.getMessage());
                    // Don't fail the warehouse creation if shelf creation fails
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedWarehouse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Raktár frissítése.
     * PUT /api/warehouses/{id}
     * Body: UpdateWarehouseRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateWarehouse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWarehouseRequest request) {
        try {
            Warehouse warehouseDetails = new Warehouse();
            warehouseDetails.setName(request.getName());
            warehouseDetails.setCode(request.getCode());
            warehouseDetails.setAddress(request.getAddress());
            warehouseDetails.setCity(request.getCity());
            warehouseDetails.setPostalCode(request.getPostalCode());
            warehouseDetails.setCountry(request.getCountry());
            warehouseDetails.setEmail(request.getEmail());
            warehouseDetails.setPhone(request.getPhone());
            warehouseDetails.setManagerId(request.getManagerId());
            warehouseDetails.setIsActive(request.getIsActive());
            warehouseDetails.setCapacity(request.getCapacity());
            warehouseDetails.setUnit(request.getUnit());
            warehouseDetails.setDescription(request.getDescription());
            warehouseDetails.setFloorPlanData(request.getFloorPlanData());

            Warehouse updatedWarehouse = warehouseService.update(id, warehouseDetails);

            return ResponseEntity.ok(convertToResponse(updatedWarehouse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Raktár deaktiválása (soft delete).
     * PATCH /api/warehouses/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivateWarehouse(@PathVariable Long id) {
        try {
            warehouseService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Warehouse deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Raktár törlése (hard delete).
     * DELETE /api/warehouses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteWarehouse(@PathVariable Long id) {
        try {
            warehouseService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Warehouse deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Warehouse entitás konvertálása WarehouseResponse DTO-vá.
     */
    private WarehouseResponse convertToResponse(Warehouse warehouse) {
        // Lekérdezzük a warehouse polcait
        List<Shelf> shelves = shelfRepository.findByWarehouseId(warehouse.getId());
        List<ShelfResponse> shelfResponses = shelves.stream()
                .map(this::convertShelfToResponse)
                .collect(Collectors.toList());

        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getCompanyId(),
                warehouse.getName(),
                warehouse.getCode(),
                warehouse.getAddress(),
                warehouse.getCity(),
                warehouse.getPostalCode(),
                warehouse.getCountry(),
                warehouse.getEmail(),
                warehouse.getPhone(),
                warehouse.getManagerId(),
                warehouse.getIsActive(),
                warehouse.getCapacity(),
                warehouse.getCurrentStock(),
                warehouse.getUnit(),
                warehouse.getDescription(),
                warehouse.getFloorPlanData(),
                warehouse.getCreatedAt(),
                warehouse.getUpdatedAt(),
                shelfResponses
        );
    }

    private ShelfResponse convertShelfToResponse(Shelf shelf) {
        Double utilizationPercentage = 0.0;
        Integer remainingCapacity = shelf.getMaxCapacity();

        if (shelf.getMaxCapacity() != null && shelf.getMaxCapacity() > 0) {
            utilizationPercentage = (shelf.getCurrentUsage() * 100.0) / shelf.getMaxCapacity();
            remainingCapacity = shelf.getMaxCapacity() - (shelf.getCurrentUsage() != null ? shelf.getCurrentUsage() : 0);
        }

        return new ShelfResponse(
                shelf.getId(),
                shelf.getWarehouseId(),
                shelf.getShapeId(),
                shelf.getType(),
                shelf.getCode(),
                shelf.getName(),
                shelf.getPositionX(),
                shelf.getPositionY(),
                shelf.getWidth(),
                shelf.getHeight(),
                shelf.getRotation(),
                shelf.getMaxCapacity(),
                shelf.getCurrentUsage(),
                shelf.getCapacityUnit(),
                shelf.getIsActive(),
                shelf.getNotes(),
                shelf.getCreatedAt(),
                shelf.getUpdatedAt(),
                utilizationPercentage,
                remainingCapacity
        );
    }
}
