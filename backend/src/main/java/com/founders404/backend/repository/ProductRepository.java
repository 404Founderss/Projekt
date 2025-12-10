package com.founders404.backend.repository;

import com.founders404.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Product repository statisztikai query-kkel.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    //Alap query

    Optional<Product> findBySku(String sku);
    Optional<Product> findByBarcode(String barcode);
    Optional<Product> findByQrCode(String qrCode);
    boolean existsBySku(String sku);
    boolean existsByBarcode(String barcode);
    List<Product> findByCompanyId(Long companyId);
    List<Product> findByCompanyIdAndIsActiveTrue(Long companyId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySupplierId(Long supplierId);
    List<Product> findByShelfId(Long shelfId);
    List<Product> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);
    List<Product> findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(Long companyId, String name);
    List<Product> findByCompanyIdAndReorderPointIsNotNull(Long companyId);

    //STATISZTIKAI QUERY

    /**
     * Kategória szerinti eloszlás.
     * Visszaadja: categoryId, termékek száma, összes készlet érték
     */
    @Query("""
        SELECT p.categoryId,
               COUNT(p),
               SUM(p.netPurchasePrice * p.currentStock)
        FROM Product p
        WHERE p.isActive = true
        AND p.categoryId IS NOT NULL
        AND (:companyId IS NULL OR p.companyId = :companyId)
        GROUP BY p.categoryId
    """)
    List<Object[]> findCategoryDistribution(@Param("companyId") Long companyId);


    @Query("""
        SELECT SUM(p.currentStock)
        FROM Product p
        WHERE p.isActive = true
        AND (:companyId IS NULL OR p.companyId = :companyId)
    """)
    Long sumCurrentStock(@Param("companyId") Long companyId);

    /**
     * Aktív termékek száma.
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = true")
    Long countActiveProducts();

    /**
     * Készleten lévő termékek (currentStock > 0).
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock > 0")
    Long countInStockProducts();

    /**
     * Kifogyott termékek (currentStock = 0).
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock = 0")
    Long countOutOfStockProducts();
}
