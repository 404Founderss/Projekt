package com.founders404.backend.service;

import com.founders404.backend.model.Category;
import com.founders404.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * A Category entitás üzleti logikája.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Összes kategória lekérése.
     */
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    /**
     * Kategória lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    /**
     * Cég összes kategóriája.
     */
    public List<Category> findByCompanyId(Long companyId) {
        return categoryRepository.findByCompanyId(companyId);
    }

    /**
     * Kategória keresése név alapján (egy cégen belül).
     * @throws RuntimeException ha nem található
     */
    public Category findByCompanyIdAndName(Long companyId, String name) {
        return categoryRepository.findByCompanyIdAndName(companyId, name)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
    }

    /**
     * Kategóriák keresése név alapján.
     */
    public List<Category> searchByName(Long companyId, String name) {
        return categoryRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Főkategóriák lekérése (nincs szülő).
     */
    public List<Category> findRootCategories(Long companyId) {
        return categoryRepository.findByCompanyIdAndParentIdIsNull(companyId);
    }

    /**
     * Gyermek kategóriák lekérése.
     */
    public List<Category> findChildCategories(Long parentId) {
        return categoryRepository.findByParentId(parentId);
    }

    /**
     * Cég adott szülő alatti kategóriái.
     */
    public List<Category> findByCompanyIdAndParentId(Long companyId, Long parentId) {
        return categoryRepository.findByCompanyIdAndParentId(companyId, parentId);
    }

    /**
     * Új kategória létrehozása.
     * @throws RuntimeException ha a név már létezik a cégnél
     */
    @Transactional
    public Category create(Category category) {
        // Név duplikáció ellenőrzés a cégen belül
        if (categoryRepository.existsByCompanyIdAndName(category.getCompanyId(), category.getName())) {
            throw new RuntimeException("Category with name already exists in this company: " + category.getName());
        }

        // Ha van parent_id, ellenőrizzük hogy létezik-e
        if (category.getParentId() != null) {
            Category parent = findById(category.getParentId());
            // Ellenőrizzük, hogy a parent ugyanahhoz a céghez tartozik-e
            if (!parent.getCompanyId().equals(category.getCompanyId())) {
                throw new RuntimeException("Parent category must belong to the same company");
            }
        }

        return categoryRepository.save(category);
    }

    /**
     * Kategória frissítése.
     * @throws RuntimeException ha nem található vagy név már létezik
     */
    @Transactional
    public Category update(Long id, Category categoryDetails) {
        Category category = findById(id);

        // Név ellenőrzés (ha változik és már létezik)
        if (categoryDetails.getName() != null
                && !categoryDetails.getName().equals(category.getName())
                && categoryRepository.existsByCompanyIdAndName(category.getCompanyId(), categoryDetails.getName())) {
            throw new RuntimeException("Category with name already exists: " + categoryDetails.getName());
        }

        // Parent ellenőrzés
        if (categoryDetails.getParentId() != null) {
            // Nem lehet saját maga a szülője
            if (categoryDetails.getParentId().equals(id)) {
                throw new RuntimeException("Category cannot be its own parent");
            }

            Category parent = findById(categoryDetails.getParentId());
            // Ellenőrizzük, hogy a parent ugyanahhoz a céghez tartozik-e
            if (!parent.getCompanyId().equals(category.getCompanyId())) {
                throw new RuntimeException("Parent category must belong to the same company");
            }
        }

        // Mezők frissítése
        if (categoryDetails.getName() != null) {
            category.setName(categoryDetails.getName());
        }
        if (categoryDetails.getParentId() != null) {
            category.setParentId(categoryDetails.getParentId());
        }
        if (categoryDetails.getDescription() != null) {
            category.setDescription(categoryDetails.getDescription());
        }

        return categoryRepository.save(category);
    }

    /**
     * Kategória törlése.
     * @throws RuntimeException ha van gyermek kategóriája
     */
    @Transactional
    public void delete(Long id) {
        Category category = findById(id);

        // Ellenőrizzük, hogy van-e gyermek kategóriája
        List<Category> children = findChildCategories(id);
        if (!children.isEmpty()) {
            throw new RuntimeException("Cannot delete category with child categories. Delete children first.");
        }

        categoryRepository.delete(category);
    }

    /**
     * Kategória fa struktúra lekérése (összes kategória hierarchikusan).
     * Ezt a Controller-ben kell összeállítani a frontend számára.
     */
    public List<Category> getCategoryTree(Long companyId) {
        return findRootCategories(companyId);
    }
}
