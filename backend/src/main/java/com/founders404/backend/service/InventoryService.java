package com.founders404.backend.service;

import com.founders404.backend.exception.InsufficientStockException;
import com.founders404.backend.model.*;
import com.founders404.backend.repository.InventoryRepository;
import com.founders404.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Készletkezelés.
 */

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    /**
     * @return A rögzített mozgás
     * @throws InsufficientStockException ha nincs elég készlet OUT/SCRAP esetén
     */
    @Transactional
    public InventoryMovement recordMovement(
            Long productId,
            MovementType movementType,
            Integer quantity,
            String reason,
            String notes,
            User user
    ) {
        // Termék lekérése
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Termék nem található: " + productId));

        // Előző készlet mentése
        Integer previousStock = product.getCurrentStock();
        Integer newStock;

        // Új készlet kiszámítása mozgás típus alapján
        switch (movementType) {
            case IN:
                newStock = previousStock + quantity;
                break;

            case OUT:
            case SCRAP:
                if (previousStock < quantity) {
                    throw new InsufficientStockException(productId, quantity, previousStock);
                }
                newStock = previousStock - quantity;
                break;

            case ADJUSTMENT:
                newStock = quantity;
                break;

            default:
                throw new IllegalArgumentException("Ismeretlen mozgás típus: " + movementType);
        }

        //Készlet frissítése a termékben
        product.setCurrentStock(newStock);
        productRepository.save(product);

        // Mozgás rögzítése
        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setUser(user);
        movement.setMovementType(movementType);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setNotes(notes);
        movement.setPreviousStock(previousStock);
        movement.setNewStock(newStock);
        movement.setTimestamp(LocalDateTime.now());

        return inventoryRepository.save(movement);
    }

    /**
     * Termék mozgástörténete.
     */
    @Transactional(readOnly = true)
    public List<InventoryMovement> getMovementHistory(Long productId) {
        return inventoryRepository.findByProductIdOrderByTimestampDesc(productId);
    }

    /**
     * Legutóbbi mozgások (dashboard-hoz).
     */
    @Transactional(readOnly = true)
    public List<InventoryMovement> getRecentMovements(int limit) {
        List<InventoryMovement> movements = inventoryRepository.findTop50ByOrderByTimestampDesc();
        return movements.stream().limit(limit).toList();
    }

    /**
     * Mozgások időintervallumban.
     */
    @Transactional(readOnly = true)
    public List<InventoryMovement> getMovementsBetween(LocalDateTime start, LocalDateTime end) {
        return inventoryRepository.findByTimestampBetween(start, end);
    }

    /**
     * Mozgások típus szerint.
     */
    @Transactional(readOnly = true)
    public List<InventoryMovement> getMovementsByType(MovementType type) {
        return inventoryRepository.findByMovementType(type);
    }

    /**
     * Teljes készlet érték számítása.
     * Összeg: (netPurchasePrice * currentStock) minden aktív termékre.
     */
    @Transactional(readOnly = true)
    public Double getInventoryValue() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(p -> p.getIsActive() && p.getNetPurchasePrice() != null)
                .mapToDouble(p -> {
                    BigDecimal price = p.getNetPurchasePrice();
                    Integer stock = p.getCurrentStock();
                    return price.doubleValue() * stock;
                })
                .sum();
    }

    /**
     * Alacsony készletű termékek listája.
     */
    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isLowStock)
                .toList();
    }

    /**
     * Cég készletmozgása.
     */
    @Transactional(readOnly = true)
    public List<InventoryMovement> getCompanyMovements(Long companyId) {
        return inventoryRepository.findByProduct_CompanyIdOrderByTimestampDesc(companyId);
    }
}
