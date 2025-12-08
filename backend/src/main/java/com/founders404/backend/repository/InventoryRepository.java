package com.founders404.backend.repository;

import com.founders404.backend.model.InventoryMovement;
import com.founders404.backend.model.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Készletmozgások repository.
 */
@Repository
public interface InventoryRepository extends JpaRepository<InventoryMovement, Long> {

    //Alap query

    List<InventoryMovement> findByProductIdOrderByTimestampDesc(Long productId);

    List<InventoryMovement> findByMovementType(MovementType movementType);

    List<InventoryMovement> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<InventoryMovement> findTop50ByOrderByTimestampDesc();

    List<InventoryMovement> findByUserIdOrderByTimestampDesc(Long userId);

    List<InventoryMovement> findByProduct_CompanyIdOrderByTimestampDesc(Long companyId);

    //STATISZTIKAI QUERY

    /**
     * Top eladott termékek (OUT mozgások összegzése).
     * Visszaadja: productId, productName, totalQuantitySold
     */
    @Query("""
        SELECT im.product.id as productId, 
               im.product.name as productName,
               im.product.sku as productSku,
               SUM(im.quantity) as totalQuantity
        FROM InventoryMovement im
        WHERE im.movementType = 'OUT'
        AND (:companyId IS NULL OR im.product.companyId = :companyId)
        GROUP BY im.product.id, im.product.name, im.product.sku
        ORDER BY SUM(im.quantity) DESC
    """)
    List<Object[]> findTopSellingProducts(@Param("companyId") Long companyId);

    /**
     * OUT mozgások dátum intervallumban (eladások).
     */
    @Query("""
        SELECT im FROM InventoryMovement im
        WHERE im.movementType = 'OUT'
        AND im.timestamp BETWEEN :startDate AND :endDate
        AND (:companyId IS NULL OR im.product.companyId = :companyId)
    """)
    List<InventoryMovement> findOutMovementsBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("companyId") Long companyId
    );

    /**
     * IN mozgások dátum intervallumban (beszerzések).
     */
    @Query("""
        SELECT im FROM InventoryMovement im
        WHERE im.movementType = 'IN'
        AND im.timestamp BETWEEN :startDate AND :endDate
        AND (:companyId IS NULL OR im.product.companyId = :companyId)
    """)
    List<InventoryMovement> findInMovementsBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("companyId") Long companyId
    );

    /**
     * Teljes bevétel
     */
    @Query("""
        SELECT SUM(im.quantity * p.grossSellingPrice)
        FROM InventoryMovement im
        JOIN im.product p
        WHERE im.movementType = 'OUT'
        AND im.timestamp BETWEEN :startDate AND :endDate
        AND (:companyId IS NULL OR p.companyId = :companyId)
    """)
    java.math.BigDecimal calculateTotalRevenue(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("companyId") Long companyId
    );

    /**
     * Teljes költség.
     */
    @Query("""
        SELECT SUM(im.quantity * p.netPurchasePrice)
        FROM InventoryMovement im
        JOIN im.product p
        WHERE im.movementType = 'IN'
        AND im.timestamp BETWEEN :startDate AND :endDate
        AND (:companyId IS NULL OR p.companyId = :companyId)
    """)
    java.math.BigDecimal calculateTotalCost(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("companyId") Long companyId
    );

    /**
     * Összes eladott termék bizonyos idő alatt.
     */
    @Query("""
        SELECT SUM(im.quantity)
        FROM InventoryMovement im
        JOIN im.product p
        WHERE im.movementType = 'OUT'
        AND im.timestamp BETWEEN :startDate AND :endDate
        AND (:companyId IS NULL OR p.companyId = :companyId)
    """)
    Long calculateTotalGoodsSoldQuantity(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("companyId") Long companyId
    );

    /**
     * Termék napi OUT mozgásai (predikciókhoz).
     */
    @Query("""
        SELECT DATE(im.timestamp) as date, SUM(im.quantity) as dailyQuantity
        FROM InventoryMovement im
        WHERE im.product.id = :productId
        AND im.movementType = 'OUT'
        AND im.timestamp >= :startDate
        GROUP BY DATE(im.timestamp)
        ORDER BY DATE(im.timestamp) DESC
    """)
    List<Object[]> findDailyOutMovements(
            @Param("productId") Long productId,
            @Param("startDate") LocalDateTime startDate
    );

    /**
     * OUT mozgások termékenkénti összesítése (átlagok számításához).
     */
    @Query("""
        SELECT im.product.id, COUNT(im), SUM(im.quantity)
        FROM InventoryMovement im
        WHERE im.movementType = 'OUT'
        AND im.timestamp >= :startDate
        GROUP BY im.product.id
    """)
    List<Object[]> findOutMovementsSummary(@Param("startDate") LocalDateTime startDate);
}
