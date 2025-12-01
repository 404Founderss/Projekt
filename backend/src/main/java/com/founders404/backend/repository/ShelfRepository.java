package com.founders404.backend.repository;

import com.founders404.backend.model.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Shelf entitáshoz.
 */
@Repository
public interface ShelfRepository extends JpaRepository<Shelf, Long> {

    /**
     * Összes polc lekérése egy raktárból.
     */
    List<Shelf> findByWarehouseId(Long warehouseId);

    /**
     * Aktív polcok lekérése egy raktárból.
     */
    List<Shelf> findByWarehouseIdAndIsActiveTrue(Long warehouseId);

    /**
     * Polc keresése kód alapján.
     */
    Optional<Shelf> findByCode(String code);

    /**
     * Polc keresése kód alapján egy adott raktárban.
     */
    Optional<Shelf> findByWarehouseIdAndCode(Long warehouseId, String code);

    /**
     * Polc keresése shape ID alapján (Konva alaprajz integráció).
     */
    Optional<Shelf> findByShapeId(String shapeId);

    /**
     * Polcok/falak lekérése típus szerint egy raktárból.
     */
    List<Shelf> findByWarehouseIdAndType(Long warehouseId, String type);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen kódú polc az adott raktárban.
     */
    boolean existsByWarehouseIdAndCode(Long warehouseId, String code);

    /**
     * Megtelt polcok lekérése egy raktárból.
     */
    @Query("SELECT s FROM Shelf s WHERE s.warehouseId = :warehouseId AND s.currentUsage >= s.maxCapacity")
    List<Shelf> findFullShelvesByWarehouseId(@Param("warehouseId") Long warehouseId);

    /**
     * Aktív cégek lekérése.
     */
    List<Shelf> findByIsActiveTrue();

    /**
     * Polcok számának lekérése egy raktárban.
     */
    long countByWarehouseId(Long warehouseId);

    /**
     * Aktív polcok számának lekérése egy raktárban.
     */
    long countByWarehouseIdAndIsActiveTrue(Long warehouseId);
}
