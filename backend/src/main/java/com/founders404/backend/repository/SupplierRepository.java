package com.founders404.backend.repository;

import com.founders404.backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Supplier entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    /**
     * Beszállító keresése név alapján.
     */
    Optional<Supplier> findByName(String name);

    /**
     * Beszállító keresése adószám alapján.
     */
    Optional<Supplier> findByTaxNumber(String taxNumber);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen adószám.
     */
    boolean existsByTaxNumber(String taxNumber);

    /**
     * Cég összes beszállítója.
     */
    List<Supplier> findByCompanyId(Long companyId);

    /**
     * Cég aktív beszállítói.
     */
    List<Supplier> findByCompanyIdAndIsActiveTrue(Long companyId);

    /**
     * Beszállítók keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Supplier> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Aktív beszállítók keresése név alapján.
     */
    List<Supplier> findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Beszállítók város szerint.
     */
    List<Supplier> findByCompanyIdAndCity(Long companyId, String city);

    /**
     * Beszállítók ország szerint.
     */
    List<Supplier> findByCompanyIdAndCountry(Long companyId, String country);
}
