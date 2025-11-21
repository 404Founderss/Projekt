package com.founders404.backend.repository;

import com.founders404.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository a Category entitáshoz.
 * Spring Data JPA automatikusan implementálja a CRUD műveleteket.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Cég összes kategóriája.
     */
    List<Category> findByCompanyId(Long companyId);

    /**
     * Kategória keresése név alapján (egy cégen belül).
     */
    Optional<Category> findByCompanyIdAndName(Long companyId, String name);

    /**
     * Kategóriák keresése név alapján (case-insensitive részleges egyezés).
     */
    List<Category> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);

    /**
     * Gyermek kategóriák lekérése (adott parent_id alatt).
     */
    List<Category> findByParentId(Long parentId);

    /**
     * Főkategóriák lekérése (nincs szülő kategória).
     */
    List<Category> findByCompanyIdAndParentIdIsNull(Long companyId);

    /**
     * Ellenőrzi, hogy létezik-e már ilyen nevű kategória a cégnél.
     */
    boolean existsByCompanyIdAndName(Long companyId, String name);

    /**
     * Cég és szülő kategória alapján.
     */
    List<Category> findByCompanyIdAndParentId(Long companyId, Long parentId);
}
