package com.founders404.backend.service;

import com.founders404.backend.model.Shelf;
import com.founders404.backend.repository.ShelfRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for the Shelf entity.
 * Managing shelves and walls in warehouses.
 */
@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ShelfRepository shelfRepository;

    /**
     * Get all shelves.
     */
    public List<Shelf> findAll() {
        return shelfRepository.findAll();
    }

    /**
     * Get shelf by ID.
     * @throws RuntimeException if not found
     */
    public Shelf findById(Long id) {
        return shelfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelf not found with id: " + id));
    }

    /**
     * Find shelf by code.
     * @throws RuntimeException if not found
     */
    public Shelf findByCode(String code) {
        return shelfRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Shelf not found with code: " + code));
    }

    /**
     * Find shelf by shape ID (Konva floor plan).
     * @throws RuntimeException if not found
     */
    public Shelf findByShapeId(String shapeId) {
        return shelfRepository.findByShapeId(shapeId)
                .orElseThrow(() -> new RuntimeException("Shelf not found with shapeId: " + shapeId));
    }

    /**
     * All shelves and walls in a warehouse.
     */
    public List<Shelf> findByWarehouseId(Long warehouseId) {
        return shelfRepository.findByWarehouseId(warehouseId);
    }

    /**
     * Active shelves in a warehouse.
     */
    public List<Shelf> findActiveByWarehouseId(Long warehouseId) {
        return shelfRepository.findByWarehouseIdAndIsActiveTrue(warehouseId);
    }

    /**
     * Get shelves or walls by type.
     */
    public List<Shelf> findByWarehouseIdAndType(Long warehouseId, String type) {
        return shelfRepository.findByWarehouseIdAndType(warehouseId, type);
    }

    /**
     * Get count of shelves in a warehouse.
     */
    public long countByWarehouseId(Long warehouseId) {
        return shelfRepository.countByWarehouseId(warehouseId);
    }

    /**
     * Create new shelf.
     * @throws RuntimeException if shelf with this code already exists in the warehouse
     */
    @Transactional
    public Shelf create(Shelf shelf) {
        // Check for code duplication (only if code exists)
        if (shelf.getCode() != null && shelfRepository.existsByWarehouseIdAndCode(
                shelf.getWarehouseId(), shelf.getCode())) {
            throw new RuntimeException("Shelf with code already exists in this warehouse: " + shelf.getCode());
        }

        return shelfRepository.save(shelf);
    }

    /**
     * Update shelf.
     * @throws RuntimeException if not found or code already exists
     */
    @Transactional
    public Shelf update(Long id, Shelf shelfDetails) {
        Shelf shelf = findById(id);

        // Check code (if changed and already exists)
        if (shelfDetails.getCode() != null
                && !shelfDetails.getCode().equals(shelf.getCode())
                && shelfRepository.existsByWarehouseIdAndCode(
                shelf.getWarehouseId(), shelfDetails.getCode())) {
            throw new RuntimeException("Shelf with code already exists in this warehouse: " + shelfDetails.getCode());
        }

        // Update fields (only non-null values)
        if (shelfDetails.getShapeId() != null) {
            shelf.setShapeId(shelfDetails.getShapeId());
        }
        if (shelfDetails.getType() != null) {
            shelf.setType(shelfDetails.getType());
        }
        if (shelfDetails.getCode() != null) {
            shelf.setCode(shelfDetails.getCode());
        }
        if (shelfDetails.getName() != null) {
            shelf.setName(shelfDetails.getName());
        }
        if (shelfDetails.getPositionX() != null) {
            shelf.setPositionX(shelfDetails.getPositionX());
        }
        if (shelfDetails.getPositionY() != null) {
            shelf.setPositionY(shelfDetails.getPositionY());
        }
        if (shelfDetails.getWidth() != null) {
            shelf.setWidth(shelfDetails.getWidth());
        }
        if (shelfDetails.getHeight() != null) {
            shelf.setHeight(shelfDetails.getHeight());
        }
        if (shelfDetails.getRotation() != null) {
            shelf.setRotation(shelfDetails.getRotation());
        }
        if (shelfDetails.getMaxCapacity() != null) {
            shelf.setMaxCapacity(shelfDetails.getMaxCapacity());
        }
        if (shelfDetails.getCurrentUsage() != null) {
            shelf.setCurrentUsage(shelfDetails.getCurrentUsage());
        }
        if (shelfDetails.getCapacityUnit() != null) {
            shelf.setCapacityUnit(shelfDetails.getCapacityUnit());
        }
        if (shelfDetails.getIsActive() != null) {
            shelf.setIsActive(shelfDetails.getIsActive());
        }
        if (shelfDetails.getNotes() != null) {
            shelf.setNotes(shelfDetails.getNotes());
        }

        return shelfRepository.save(shelf);
    }

    /**
     * Deactivate shelf (soft delete).
     */
    @Transactional
    public void deactivate(Long id) {
        Shelf shelf = findById(id);
        shelf.setIsActive(false);
        shelfRepository.save(shelf);
    }

    /**
     * Permanently delete shelf.
     */
    @Transactional
    public void delete(Long id) {
        Shelf shelf = findById(id);
        shelfRepository.delete(shelf);
    }

    /**
     * Batch create from warehouse floor plan (Konva shapes).
     * When the frontend saves the floor plan, all shapes are saved as shelves/walls.
     */
    @Transactional
    public List<Shelf> createBatch(List<Shelf> shelves) {
        return shelfRepository.saveAll(shelves);
    }

    /**
     * Delete all shelves in a warehouse.
     */
    @Transactional
    public void deleteAllByWarehouseId(Long warehouseId) {
        List<Shelf> shelves = shelfRepository.findByWarehouseId(warehouseId);
        shelfRepository.deleteAll(shelves);
    }
}
