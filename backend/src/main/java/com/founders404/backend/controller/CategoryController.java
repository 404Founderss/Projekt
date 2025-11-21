package com.founders404.backend.controller;

import com.founders404.backend.dto.CategoryResponse;
import com.founders404.backend.dto.CreateCategoryRequest;
import com.founders404.backend.dto.UpdateCategoryRequest;
import com.founders404.backend.model.Category;
import com.founders404.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Category entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Összes kategória lekérése szűrési lehetőségekkel.
     * GET /api/categories?companyId=1&search=elektronika&parentId=5
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) Boolean rootOnly) {

        List<Category> categories;

        if (companyId != null && search != null && !search.isEmpty()) {
            // Keresés név alapján
            categories = categoryService.searchByName(companyId, search);
        } else if (companyId != null && rootOnly != null && rootOnly) {
            // Főkategóriák (nincs parent)
            categories = categoryService.findRootCategories(companyId);
        } else if (companyId != null && parentId != null) {
            // Adott szülő alatti kategóriák
            categories = categoryService.findByCompanyIdAndParentId(companyId, parentId);
        } else if (companyId != null) {
            // Cég összes kategóriája
            categories = categoryService.findByCompanyId(companyId);
        } else if (parentId != null) {
            // Gyermek kategóriák
            categories = categoryService.findChildCategories(parentId);
        } else {
            // Minden kategória
            categories = categoryService.findAll();
        }

        List<CategoryResponse> response = categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Kategória lekérése ID alapján.
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.findById(id);
            return ResponseEntity.ok(convertToResponse(category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gyermek kategóriák lekérése.
     * GET /api/categories/{id}/children
     */
    @GetMapping("/{id}/children")
    public ResponseEntity<List<CategoryResponse>> getChildCategories(@PathVariable Long id) {
        List<Category> categories = categoryService.findChildCategories(id);
        List<CategoryResponse> response = categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Kategória fa struktúra lekérése (főkategóriák).
     * GET /api/categories/tree?companyId=1
     */
    @GetMapping("/tree")
    public ResponseEntity<Object> getCategoryTree(@RequestParam Long companyId) {
        try {
            List<Category> rootCategories = categoryService.getCategoryTree(companyId);
            List<CategoryResponse> response = rootCategories.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Új kategória létrehozása.
     * POST /api/categories
     * Body: CreateCategoryRequest
     */
    @PostMapping
    public ResponseEntity<Object> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        try {
            Category category = new Category();
            category.setCompanyId(request.getCompanyId());
            category.setName(request.getName());
            category.setParentId(request.getParentId());
            category.setDescription(request.getDescription());

            Category savedCategory = categoryService.create(category);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Kategória frissítése.
     * PUT /api/categories/{id}
     * Body: UpdateCategoryRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        try {
            Category categoryDetails = new Category();
            categoryDetails.setName(request.getName());
            categoryDetails.setParentId(request.getParentId());
            categoryDetails.setDescription(request.getDescription());

            Category updatedCategory = categoryService.update(id, categoryDetails);

            return ResponseEntity.ok(convertToResponse(updatedCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Kategória törlése.
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Category entitás konvertálása CategoryResponse DTO-vá.
     */
    private CategoryResponse convertToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getCompanyId(),
                category.getName(),
                category.getParentId(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
