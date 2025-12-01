package com.founders404.backend.repository;

import com.founders404.backend.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Warehouse entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    /**
     * Raktár keresése kód alapján.
     */
    Optional<Warehouse> findByCode(String code);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen kóddal raktár.
     */
    boolean existsByCode(String code);

    /**
     * Cég összes raktára.
     */
    List<Warehouse> findByCompanyId(Long companyId);

    /**
     * Cég aktív raktárai.
     */
    List<Warehouse> findByCompanyIdAndIsActiveTrue(Long companyId);

    /**
     * Raktárak keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Warehouse> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Aktív raktárak cég és név szerint.
     */
    List<Warehouse> findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Raktár keresése vezető szerint.
     */
    List<Warehouse> findByManagerId(Long managerId);

    /**
     * Város szerinti szűrés.
     */
    List<Warehouse> findByCompanyIdAndCity(Long companyId, String city);
}
