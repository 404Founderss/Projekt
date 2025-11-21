package com.founders404.backend.service;

import com.founders404.backend.model.Company;
import com.founders404.backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * A Company entitás üzleti logikája.
 */
@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    /**
     * Összes cég lekérése.
     */
    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    /**
     * Cég lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Company findById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    /**
     * Cég keresése név alapján.
     * @throws RuntimeException ha nem található
     */
    public Company findByName(String name) {
        return companyRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Company not found with name: " + name));
    }

    /**
     * Cég keresése adószám alapján.
     * @throws RuntimeException ha nem található
     */
    public Company findByTaxNumber(String taxNumber) {
        return companyRepository.findByTaxNumber(taxNumber)
                .orElseThrow(() -> new RuntimeException("Company not found with tax number: " + taxNumber));
    }

    /**
     * Cég keresése cégjegyzékszám alapján.
     * @throws RuntimeException ha nem található
     */
    public Company findByRegistrationNumber(String registrationNumber) {
        return companyRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Company not found with registration number: " + registrationNumber));
    }

    /**
     * Aktív cégek lekérése.
     */
    public List<Company> findAllActive() {
        return companyRepository.findByIsActiveTrue();
    }

    /**
     * Cégek keresése név alapján.
     */
    public List<Company> searchByName(String name) {
        return companyRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Aktív cégek keresése név alapján.
     */
    public List<Company> searchActiveByName(String name) {
        return companyRepository.findByIsActiveTrueAndNameContainingIgnoreCase(name);
    }

    /**
     * Cégek előfizetési csomag szerint.
     */
    public List<Company> findBySubscriptionPlan(Company.SubscriptionPlan subscriptionPlan) {
        return companyRepository.findBySubscriptionPlan(subscriptionPlan);
    }

    /**
     * Lejárt előfizetésű cégek.
     */
    public List<Company> findExpiredSubscriptions() {
        return companyRepository.findBySubscriptionExpiresAtBefore(LocalDate.now());
    }

    /**
     * Hamarosan lejáró előfizetések (következő N napon belül).
     */
    public List<Company> findExpiringSubscriptions(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);
        return companyRepository.findBySubscriptionExpiresAtBetween(today, futureDate);
    }

    /**
     * Cégek város szerint.
     */
    public List<Company> findByCity(String city) {
        return companyRepository.findByCity(city);
    }

    /**
     * Cégek ország szerint.
     */
    public List<Company> findByCountry(String country) {
        return companyRepository.findByCountry(country);
    }

    /**
     * Új cég létrehozása.
     * @throws RuntimeException ha adószám vagy cégjegyzékszám már létezik
     */
    @Transactional
    public Company create(Company company) {
        // Adószám duplikáció ellenőrzés
        if (company.getTaxNumber() != null && companyRepository.existsByTaxNumber(company.getTaxNumber())) {
            throw new RuntimeException("Company with tax number already exists: " + company.getTaxNumber());
        }

        // Cégjegyzékszám duplikáció ellenőrzés
        if (company.getRegistrationNumber() != null
                && companyRepository.existsByRegistrationNumber(company.getRegistrationNumber())) {
            throw new RuntimeException("Company with registration number already exists: " + company.getRegistrationNumber());
        }

        return companyRepository.save(company);
    }

    /**
     * Cég frissítése.
     * @throws RuntimeException ha nem található vagy adószám/cégjegyzékszám már létezik
     */
    @Transactional
    public Company update(Long id, Company companyDetails) {
        Company company = findById(id);

        // Adószám ellenőrzés (ha változik és már létezik)
        if (companyDetails.getTaxNumber() != null
                && !companyDetails.getTaxNumber().equals(company.getTaxNumber())
                && companyRepository.existsByTaxNumber(companyDetails.getTaxNumber())) {
            throw new RuntimeException("Company with tax number already exists: " + companyDetails.getTaxNumber());
        }

        // Cégjegyzékszám ellenőrzés (ha változik és már létezik)
        if (companyDetails.getRegistrationNumber() != null
                && !companyDetails.getRegistrationNumber().equals(company.getRegistrationNumber())
                && companyRepository.existsByRegistrationNumber(companyDetails.getRegistrationNumber())) {
            throw new RuntimeException("Company with registration number already exists: " + companyDetails.getRegistrationNumber());
        }

        // Mezők frissítése (csak nem null értékek)
        if (companyDetails.getName() != null) {
            company.setName(companyDetails.getName());
        }
        if (companyDetails.getTaxNumber() != null) {
            company.setTaxNumber(companyDetails.getTaxNumber());
        }
        if (companyDetails.getRegistrationNumber() != null) {
            company.setRegistrationNumber(companyDetails.getRegistrationNumber());
        }
        if (companyDetails.getAddress() != null) {
            company.setAddress(companyDetails.getAddress());
        }
        if (companyDetails.getCity() != null) {
            company.setCity(companyDetails.getCity());
        }
        if (companyDetails.getPostalCode() != null) {
            company.setPostalCode(companyDetails.getPostalCode());
        }
        if (companyDetails.getCountry() != null) {
            company.setCountry(companyDetails.getCountry());
        }
        if (companyDetails.getEmail() != null) {
            company.setEmail(companyDetails.getEmail());
        }
        if (companyDetails.getPhone() != null) {
            company.setPhone(companyDetails.getPhone());
        }
        if (companyDetails.getIsActive() != null) {
            company.setIsActive(companyDetails.getIsActive());
        }
        if (companyDetails.getSubscriptionPlan() != null) {
            company.setSubscriptionPlan(companyDetails.getSubscriptionPlan());
        }
        if (companyDetails.getSubscriptionExpiresAt() != null) {
            company.setSubscriptionExpiresAt(companyDetails.getSubscriptionExpiresAt());
        }

        return companyRepository.save(company);
    }

    /**
     * Cég deaktiválása (soft delete).
     */
    @Transactional
    public void deactivate(Long id) {
        Company company = findById(id);
        company.setIsActive(false);
        companyRepository.save(company);
    }

    /**
     * Cég végleges törlése.
     */
    @Transactional
    public void delete(Long id) {
        Company company = findById(id);
        companyRepository.delete(company);
    }

    /**
     * Előfizetés meghosszabbítása.
     */
    @Transactional
    public Company extendSubscription(Long id, int daysToAdd) {
        Company company = findById(id);
        LocalDate currentExpiration = company.getSubscriptionExpiresAt();

        if (currentExpiration == null || currentExpiration.isBefore(LocalDate.now())) {
            // Ha lejárt vagy nincs beállítva, a mai naptól számítunk
            company.setSubscriptionExpiresAt(LocalDate.now().plusDays(daysToAdd));
        } else {
            // Ha még aktív, a jelenlegi lejárati dátumhoz adunk hozzá
            company.setSubscriptionExpiresAt(currentExpiration.plusDays(daysToAdd));
        }

        return companyRepository.save(company);
    }

    /**
     * Előfizetési csomag váltása.
     */
    @Transactional
    public Company changeSubscriptionPlan(Long id, Company.SubscriptionPlan newPlan) {
        Company company = findById(id);
        company.setSubscriptionPlan(newPlan);
        return companyRepository.save(company);
    }
}
