package com.founders404.backend.service;

import com.founders404.backend.model.Supplier;
import com.founders404.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * A Supplier entitás üzleti logikája.
 */
@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    /**
     * Összes beszállító lekérése.
     */
    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    /**
     * Beszállító lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Supplier findById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    /**
     * Beszállító keresése név alapján.
     * @throws RuntimeException ha nem található
     */
    public Supplier findByName(String name) {
        return supplierRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Supplier not found with name: " + name));
    }

    /**
     * Beszállító keresése adószám alapján.
     * @throws RuntimeException ha nem található
     */
    public Supplier findByTaxNumber(String taxNumber) {
        return supplierRepository.findByTaxNumber(taxNumber)
                .orElseThrow(() -> new RuntimeException("Supplier not found with tax number: " + taxNumber));
    }

    /**
     * Cég összes beszállítója.
     */
    public List<Supplier> findByCompanyId(Long companyId) {
        return supplierRepository.findByCompanyId(companyId);
    }

    /**
     * Cég aktív beszállítói.
     */
    public List<Supplier> findActiveByCompanyId(Long companyId) {
        return supplierRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    /**
     * Beszállítók keresése név alapján.
     */
    public List<Supplier> searchByName(Long companyId, String name) {
        return supplierRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Aktív beszállítók keresése név alapján.
     */
    public List<Supplier> searchActiveByName(Long companyId, String name) {
        return supplierRepository.findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Beszállítók város szerint.
     */
    public List<Supplier> findByCity(Long companyId, String city) {
        return supplierRepository.findByCompanyIdAndCity(companyId, city);
    }

    /**
     * Beszállítók ország szerint.
     */
    public List<Supplier> findByCountry(Long companyId, String country) {
        return supplierRepository.findByCompanyIdAndCountry(companyId, country);
    }

    /**
     * Új beszállító létrehozása.
     * @throws RuntimeException ha adószám már létezik
     */
    @Transactional
    public Supplier create(Supplier supplier) {
        // Adószám duplikáció ellenőrzés
        if (supplier.getTaxNumber() != null && supplierRepository.existsByTaxNumber(supplier.getTaxNumber())) {
            throw new RuntimeException("Supplier with tax number already exists: " + supplier.getTaxNumber());
        }

        return supplierRepository.save(supplier);
    }

    /**
     * Beszállító frissítése.
     * @throws RuntimeException ha nem található vagy adószám már létezik
     */
    @Transactional
    public Supplier update(Long id, Supplier supplierDetails) {
        Supplier supplier = findById(id);

        // Adószám ellenőrzés (ha változik és már létezik)
        if (supplierDetails.getTaxNumber() != null
                && !supplierDetails.getTaxNumber().equals(supplier.getTaxNumber())
                && supplierRepository.existsByTaxNumber(supplierDetails.getTaxNumber())) {
            throw new RuntimeException("Supplier with tax number already exists: " + supplierDetails.getTaxNumber());
        }

        // Mezők frissítése (csak nem null értékek)
        if (supplierDetails.getName() != null) {
            supplier.setName(supplierDetails.getName());
        }
        if (supplierDetails.getContactName() != null) {
            supplier.setContactName(supplierDetails.getContactName());
        }
        if (supplierDetails.getEmail() != null) {
            supplier.setEmail(supplierDetails.getEmail());
        }
        if (supplierDetails.getPhone() != null) {
            supplier.setPhone(supplierDetails.getPhone());
        }
        if (supplierDetails.getAddress() != null) {
            supplier.setAddress(supplierDetails.getAddress());
        }
        if (supplierDetails.getCity() != null) {
            supplier.setCity(supplierDetails.getCity());
        }
        if (supplierDetails.getPostalCode() != null) {
            supplier.setPostalCode(supplierDetails.getPostalCode());
        }
        if (supplierDetails.getCountry() != null) {
            supplier.setCountry(supplierDetails.getCountry());
        }
        if (supplierDetails.getTaxNumber() != null) {
            supplier.setTaxNumber(supplierDetails.getTaxNumber());
        }
        if (supplierDetails.getIsActive() != null) {
            supplier.setIsActive(supplierDetails.getIsActive());
        }
        if (supplierDetails.getNotes() != null) {
            supplier.setNotes(supplierDetails.getNotes());
        }

        return supplierRepository.save(supplier);
    }

    /**
     * Beszállító deaktiválása (soft delete).
     */
    @Transactional
    public void deactivate(Long id) {
        Supplier supplier = findById(id);
        supplier.setIsActive(false);
        supplierRepository.save(supplier);
    }

    /**
     * Beszállító végleges törlése.
     */
    @Transactional
    public void delete(Long id) {
        Supplier supplier = findById(id);
        supplierRepository.delete(supplier);
    }
}
