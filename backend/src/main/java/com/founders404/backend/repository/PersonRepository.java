package com.founders404.backend.repository;

import com.founders404.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    /**
     * Személy keresése email alapján.
     * Spring Data JPA automatikusan létrehozza a query-t a metódus névből!
     */
    Optional<Person> findByEmail(String email);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen email.
     * Hasznos létrehozásnál!
     */
    boolean existsByEmail(String email);

    /**
     * Aktív személyek lekérése.
     */
    List<Person> findByIsActiveTrue();

    /**
     * Személyek keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Person> findByFullNameContainingIgnoreCase(String name);
}
