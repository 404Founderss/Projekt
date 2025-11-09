package com.founders404.backend.repository;

import com.founders404.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA repository a User entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Felhasználó keresése username alapján.
     * Spring Data JPA automatikusan létrehozza a query-t a metódus névből!
     */
    Optional<User> findByUsername(String username);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen username.
     * Hasznos regisztrációnál!
     */
    boolean existsByUsername(String username);
}