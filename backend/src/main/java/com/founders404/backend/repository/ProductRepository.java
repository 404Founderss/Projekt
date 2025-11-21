package com.founders404.backend.repository;

import com.founders404.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Product entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Termék keresése SKU alapján.
     */
    Optional<Product> findBySku(String sku);

    /**
     * Termék keresése vonalkód alapján.
     */
    Optional<Product> findByBarcode(String barcode);

    /**
     * Termék keresése QR kód alapján.
     */
    Optional<Product> findByQrCode(String qrCode);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen SKU.
     */
    boolean existsBySku(String sku);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen vonalkód.
     */
    boolean existsByBarcode(String barcode);

    /**
     * Cég összes terméke.
     */
    List<Product> findByCompanyId(Long companyId);

    /**
     * Cég aktív termékei.
     */
    List<Product> findByCompanyIdAndIsActiveTrue(Long companyId);

    /**
     * Kategória szerint szűrés.
     */
    List<Product> findByCategoryId(Long categoryId);

    /**
     * Beszállító szerint szűrés.
     */
    List<Product> findBySupplierId(Long supplierId);

    /**
     * Termékek keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Product> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Aktív termékek cég és név szerint.
     */
    List<Product> findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Alacsony készletű termékek (quantity < reorderPoint).
     * Ehhez custom query kellene, de egyszerűsítve:
     * Termékek ahol reorderPoint > 0 (később lehet bővíteni).
     */
    List<Product> findByCompanyIdAndReorderPointIsNotNull(Long companyId);
}
