package com.founders404.backend.repository;

import com.founders404.backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Company entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Cég keresése név alapján.
     */
    Optional<Company> findByName(String name);

    /**
     * Cég keresése adószám alapján.
     */
    Optional<Company> findByTaxNumber(String taxNumber);

    /**
     * Cég keresése cégjegyzékszám alapján.
     */
    Optional<Company> findByRegistrationNumber(String registrationNumber);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen adószám.
     */
    boolean existsByTaxNumber(String taxNumber);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen cégjegyzékszám.
     */
    boolean existsByRegistrationNumber(String registrationNumber);

    /**
     * Aktív cégek lekérése.
     */
    List<Company> findByIsActiveTrue();

    /**
     * Cégek keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Company> findByNameContainingIgnoreCase(String name);

    /**
     * Aktív cégek keresése név alapján.
     */
    List<Company> findByIsActiveTrueAndNameContainingIgnoreCase(String name);

    /**
     * Cégek város szerint.
     */
    List<Company> findByCity(String city);

    /**
     * Cégek ország szerint.
     */
    List<Company> findByCountry(String country);
}
