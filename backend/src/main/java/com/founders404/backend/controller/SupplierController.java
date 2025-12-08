package com.founders404.backend.controller;

import com.founders404.backend.dto.CreateSupplierRequest;
import com.founders404.backend.dto.SupplierResponse;
import com.founders404.backend.dto.UpdateSupplierRequest;
import com.founders404.backend.model.Supplier;
import com.founders404.backend.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Supplier entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * Összes beszállító lekérése szűrési lehetőségekkel.
     * GET /api/suppliers?companyId=1&active=true&search=acme&city=Budapest&country=Hungary
     */
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country) {

        List<Supplier> suppliers;

        if (companyId != null && search != null && !search.isEmpty()) {
            // Keresés név alapján
            if (active != null && active) {
                suppliers = supplierService.searchActiveByName(companyId, search);
            } else {
                suppliers = supplierService.searchByName(companyId, search);
            }
        } else if (companyId != null && city != null && !city.isEmpty()) {
            // Város szerint
            suppliers = supplierService.findByCity(companyId, city);
        } else if (companyId != null && country != null && !country.isEmpty()) {
            // Ország szerint
            suppliers = supplierService.findByCountry(companyId, country);
        } else if (companyId != null && active != null && active) {
            // Csak aktívak
            suppliers = supplierService.findActiveByCompanyId(companyId);
        } else if (companyId != null) {
            // Cég összes beszállítója
            suppliers = supplierService.findByCompanyId(companyId);
        } else {
            // Minden beszállító
            suppliers = supplierService.findAll();
        }

        List<SupplierResponse> response = suppliers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Beszállító lekérése ID alapján.
     * GET /api/suppliers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getSupplierById(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.findById(id);
            return ResponseEntity.ok(convertToResponse(supplier));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Beszállító lekérése adószám alapján.
     * GET /api/suppliers/tax/{taxNumber}
     */
    @GetMapping("/tax/{taxNumber}")
    public ResponseEntity<Object> getSupplierByTaxNumber(@PathVariable String taxNumber) {
        try {
            Supplier supplier = supplierService.findByTaxNumber(taxNumber);
            return ResponseEntity.ok(convertToResponse(supplier));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Új beszállító létrehozása.
     * POST /api/suppliers
     * Body: CreateSupplierRequest
     */
    @PostMapping
    public ResponseEntity<Object> createSupplier(@Valid @RequestBody CreateSupplierRequest request) {
        try {
            Supplier supplier = new Supplier();
            supplier.setCompanyId(request.getCompanyId());
            supplier.setName(request.getName());
            supplier.setContactName(request.getContactName());
            supplier.setEmail(request.getEmail());
            supplier.setPhone(request.getPhone());
            supplier.setAddress(request.getAddress());
            supplier.setCity(request.getCity());
            supplier.setPostalCode(request.getPostalCode());
            supplier.setCountry(request.getCountry());
            supplier.setTaxNumber(request.getTaxNumber());
            supplier.setNotes(request.getNotes());
            supplier.setIsActive(true);

            Supplier savedSupplier = supplierService.create(supplier);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedSupplier));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Beszállító frissítése.
     * PUT /api/suppliers/{id}
     * Body: UpdateSupplierRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSupplierRequest request) {
        try {
            Supplier supplierDetails = new Supplier();
            supplierDetails.setName(request.getName());
            supplierDetails.setContactName(request.getContactName());
            supplierDetails.setEmail(request.getEmail());
            supplierDetails.setPhone(request.getPhone());
            supplierDetails.setAddress(request.getAddress());
            supplierDetails.setCity(request.getCity());
            supplierDetails.setPostalCode(request.getPostalCode());
            supplierDetails.setCountry(request.getCountry());
            supplierDetails.setTaxNumber(request.getTaxNumber());
            supplierDetails.setIsActive(request.getIsActive());
            supplierDetails.setNotes(request.getNotes());

            Supplier updatedSupplier = supplierService.update(id, supplierDetails);

            return ResponseEntity.ok(convertToResponse(updatedSupplier));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Beszállító deaktiválása (soft delete).
     * PATCH /api/suppliers/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivateSupplier(@PathVariable Long id) {
        try {
            supplierService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Supplier deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Beszállító törlése (hard delete).
     * DELETE /api/suppliers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Supplier deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Supplier entitás konvertálása SupplierResponse DTO-vá.
     */
    private SupplierResponse convertToResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getCompanyId(),
                supplier.getName(),
                supplier.getContactName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getCity(),
                supplier.getPostalCode(),
                supplier.getCountry(),
                supplier.getTaxNumber(),
                supplier.getIsActive(),
                supplier.getNotes(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt()
        );
    }
}
