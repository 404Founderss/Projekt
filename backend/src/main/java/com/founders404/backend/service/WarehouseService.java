package com.founders404.backend.service;

import com.founders404.backend.model.Warehouse;
import com.founders404.backend.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * A Warehouse entitás üzleti logikája.
 */
@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    /**
     * Összes raktár lekérése.
     */
    public List<Warehouse> findAll() {
        return warehouseRepository.findAll();
    }

    /**
     * Raktár lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Warehouse findById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
    }

    /**
     * Raktár keresése kód alapján.
     * @throws RuntimeException ha nem található
     */
    public Warehouse findByCode(String code) {
        return warehouseRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with code: " + code));
    }

    /**
     * Cég összes raktára.
     */
    public List<Warehouse> findByCompanyId(Long companyId) {
        return warehouseRepository.findByCompanyId(companyId);
    }

    /**
     * Cég aktív raktárai.
     */
    public List<Warehouse> findActiveByCompanyId(Long companyId) {
        return warehouseRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    /**
     * Raktárak keresése név alapján.
     */
    public List<Warehouse> searchByName(Long companyId, String name) {
        return warehouseRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Aktív raktárak keresése név alapján.
     */
    public List<Warehouse> searchActiveByName(Long companyId, String name) {
        return warehouseRepository.findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Raktárak keresése vezető szerint.
     */
    public List<Warehouse> findByManagerId(Long managerId) {
        return warehouseRepository.findByManagerId(managerId);
    }

    /**
     * Raktárak keresése város szerint.
     */
    public List<Warehouse> findByCity(Long companyId, String city) {
        return warehouseRepository.findByCompanyIdAndCity(companyId, city);
    }

    /**
     * Új raktár létrehozása.
     * @throws RuntimeException ha a kód már létezik
     */
    @Transactional
    public Warehouse create(Warehouse warehouse) {
        // Kód duplikáció ellenőrzés
        if (warehouse.getCode() != null && warehouseRepository.existsByCode(warehouse.getCode())) {
            throw new RuntimeException("Warehouse with code already exists: " + warehouse.getCode());
        }

        return warehouseRepository.save(warehouse);
    }

    /**
     * Raktár frissítése.
     * @throws RuntimeException ha nem található vagy kód már létezik
     */
    @Transactional
    public Warehouse update(Long id, Warehouse warehouseDetails) {
        Warehouse warehouse = findById(id);

        // Kód ellenőrzés (ha változik és már létezik)
        if (warehouseDetails.getCode() != null
                && !warehouseDetails.getCode().equals(warehouse.getCode())
                && warehouseRepository.existsByCode(warehouseDetails.getCode())) {
            throw new RuntimeException("Warehouse with code already exists: " + warehouseDetails.getCode());
        }

        // Mezők frissítése (csak nem null értékek)
        if (warehouseDetails.getName() != null) {
            warehouse.setName(warehouseDetails.getName());
        }
        if (warehouseDetails.getCode() != null) {
            warehouse.setCode(warehouseDetails.getCode());
        }
        if (warehouseDetails.getAddress() != null) {
            warehouse.setAddress(warehouseDetails.getAddress());
        }
        if (warehouseDetails.getCity() != null) {
            warehouse.setCity(warehouseDetails.getCity());
        }
        if (warehouseDetails.getPostalCode() != null) {
            warehouse.setPostalCode(warehouseDetails.getPostalCode());
        }
        if (warehouseDetails.getCountry() != null) {
            warehouse.setCountry(warehouseDetails.getCountry());
        }
        if (warehouseDetails.getEmail() != null) {
            warehouse.setEmail(warehouseDetails.getEmail());
        }
        if (warehouseDetails.getPhone() != null) {
            warehouse.setPhone(warehouseDetails.getPhone());
        }
        if (warehouseDetails.getManagerId() != null) {
            warehouse.setManagerId(warehouseDetails.getManagerId());
        }
        if (warehouseDetails.getIsActive() != null) {
            warehouse.setIsActive(warehouseDetails.getIsActive());
        }
        if (warehouseDetails.getCapacity() != null) {
            warehouse.setCapacity(warehouseDetails.getCapacity());
        }
        if (warehouseDetails.getUnit() != null) {
            warehouse.setUnit(warehouseDetails.getUnit());
        }
        if (warehouseDetails.getDescription() != null) {
            warehouse.setDescription(warehouseDetails.getDescription());
        }
        if (warehouseDetails.getFloorPlanData() != null) {
            warehouse.setFloorPlanData(warehouseDetails.getFloorPlanData());
        }

        return warehouseRepository.save(warehouse);
    }

    /**
     * Raktár deaktiválása (soft delete).
     */
    @Transactional
    public void deactivate(Long id) {
        Warehouse warehouse = findById(id);
        warehouse.setIsActive(false);
        warehouseRepository.save(warehouse);
    }

    /**
     * Raktár végleges törlése.
     */
    @Transactional
    public void delete(Long id) {
        Warehouse warehouse = findById(id);
        warehouseRepository.delete(warehouse);
    }
}
