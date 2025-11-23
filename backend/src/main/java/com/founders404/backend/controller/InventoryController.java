package com.founders404.backend.controller;

import com.founders404.backend.dto.InventoryMovementDTO;
import com.founders404.backend.dto.InventoryMovementRequest;
import com.founders404.backend.exception.InsufficientStockException;
import com.founders404.backend.model.InventoryMovement;
import com.founders404.backend.model.MovementType;
import com.founders404.backend.model.Product;
import com.founders404.backend.model.User;
import com.founders404.backend.service.InventoryService;
import com.founders404.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Készletkezelési REST API.
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final UserService userService;

    /**
     * Készletmozgás rögzítése.
     * POST /api/inventory/movements
     */
    @PostMapping("/movements")
    public ResponseEntity<Object> recordMovement(
            @Valid @RequestBody InventoryMovementRequest request,
            Authentication authentication
    ) {
        try {
            // Aktuális user lekérése
            String username = authentication.getName();
            User user = userService.findByUsername(username);

            // Mozgás rögzítése
            InventoryMovement movement = inventoryService.recordMovement(
                    request.getProductId(),
                    request.getMovementType(),
                    request.getQuantity(),
                    request.getReason(),
                    request.getNotes(),
                    user
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(InventoryMovementDTO.fromEntity(movement));

        } catch (InsufficientStockException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "productId", e.getProductId(),
                            "requestedQuantity", e.getRequestedQuantity(),
                            "availableQuantity", e.getAvailableQuantity()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Termék mozgástörténete.
     */
    @GetMapping("/movements/product/{productId}")
    public ResponseEntity<List<InventoryMovementDTO>> getProductHistory(
            @PathVariable Long productId
    ) {
        List<InventoryMovement> movements = inventoryService.getMovementHistory(productId);
        List<InventoryMovementDTO> dtos = movements.stream()
                .map(InventoryMovementDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Legutóbbi mozgások (dashboard).
     */
    @GetMapping("/movements/recent")
    public ResponseEntity<List<InventoryMovementDTO>> getRecentMovements(
            @RequestParam(defaultValue = "50") int limit
    ) {
        List<InventoryMovement> movements = inventoryService.getRecentMovements(limit);
        List<InventoryMovementDTO> dtos = movements.stream()
                .map(InventoryMovementDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Mozgások időintervallumban.
     */
    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovementDTO>> getMovementsBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<InventoryMovement> movements = inventoryService.getMovementsBetween(start, end);
        List<InventoryMovementDTO> dtos = movements.stream()
                .map(InventoryMovementDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Mozgások típus szerint.
     */
    @GetMapping("/movements/type/{type}")
    public ResponseEntity<List<InventoryMovementDTO>> getMovementsByType(
            @PathVariable MovementType type
    ) {
        List<InventoryMovement> movements = inventoryService.getMovementsByType(type);
        List<InventoryMovementDTO> dtos = movements.stream()
                .map(InventoryMovementDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Teljes készlet érték.
     */
    @GetMapping("/value")
    public ResponseEntity<Map<String, Double>> getTotalInventoryValue() {
        Double value = inventoryService.getInventoryValue();
        return ResponseEntity.ok(Map.of("totalValue", value));
    }

    /**
     * Alacsony készletű termékek.
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }
}
