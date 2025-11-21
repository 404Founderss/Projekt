package com.founders404.backend.controller;

import com.founders404.backend.dto.CompanyResponse;
import com.founders404.backend.dto.CreateCompanyRequest;
import com.founders404.backend.dto.UpdateCompanyRequest;
import com.founders404.backend.model.Company;
import com.founders404.backend.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Company entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    /**
     * Összes cég lekérése szűrési lehetőségekkel.
     * GET /api/companies?active=true&search=tech&city=Budapest&subscriptionPlan=PRO
     */
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Company.SubscriptionPlan subscriptionPlan) {

        List<Company> companies;

        if (search != null && !search.isEmpty()) {
            // Keresés név alapján
            if (active != null && active) {
                companies = companyService.searchActiveByName(search);
            } else {
                companies = companyService.searchByName(search);
            }
        } else if (city != null && !city.isEmpty()) {
            // Város szerint
            companies = companyService.findByCity(city);
        } else if (country != null && !country.isEmpty()) {
            // Ország szerint
            companies = companyService.findByCountry(country);
        } else if (subscriptionPlan != null) {
            // Előfizetési csomag szerint
            companies = companyService.findBySubscriptionPlan(subscriptionPlan);
        } else if (active != null && active) {
            // Csak aktívak
            companies = companyService.findAllActive();
        } else {
            // Minden cég
            companies = companyService.findAll();
        }

        List<CompanyResponse> response = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Cég lekérése ID alapján.
     * GET /api/companies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getCompanyById(@PathVariable Long id) {
        try {
            Company company = companyService.findById(id);
            return ResponseEntity.ok(convertToResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cég lekérése adószám alapján.
     * GET /api/companies/tax/{taxNumber}
     */
    @GetMapping("/tax/{taxNumber}")
    public ResponseEntity<Object> getCompanyByTaxNumber(@PathVariable String taxNumber) {
        try {
            Company company = companyService.findByTaxNumber(taxNumber);
            return ResponseEntity.ok(convertToResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cég lekérése cégjegyzékszám alapján.
     * GET /api/companies/registration/{registrationNumber}
     */
    @GetMapping("/registration/{registrationNumber}")
    public ResponseEntity<Object> getCompanyByRegistrationNumber(@PathVariable String registrationNumber) {
        try {
            Company company = companyService.findByRegistrationNumber(registrationNumber);
            return ResponseEntity.ok(convertToResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Lejárt előfizetésű cégek lekérése.
     * GET /api/companies/subscriptions/expired
     */
    @GetMapping("/subscriptions/expired")
    public ResponseEntity<List<CompanyResponse>> getExpiredSubscriptions() {
        List<Company> companies = companyService.findExpiredSubscriptions();
        List<CompanyResponse> response = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Hamarosan lejáró előfizetések lekérése.
     * GET /api/companies/subscriptions/expiring?days=30
     */
    @GetMapping("/subscriptions/expiring")
    public ResponseEntity<List<CompanyResponse>> getExpiringSubscriptions(
            @RequestParam(defaultValue = "30") int days) {
        List<Company> companies = companyService.findExpiringSubscriptions(days);
        List<CompanyResponse> response = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Új cég létrehozása.
     * POST /api/companies
     * Body: CreateCompanyRequest
     */
    @PostMapping
    public ResponseEntity<Object> createCompany(@Valid @RequestBody CreateCompanyRequest request) {
        try {
            Company company = new Company();
            company.setName(request.getName());
            company.setTaxNumber(request.getTaxNumber());
            company.setRegistrationNumber(request.getRegistrationNumber());
            company.setAddress(request.getAddress());
            company.setCity(request.getCity());
            company.setPostalCode(request.getPostalCode());
            company.setCountry(request.getCountry());
            company.setEmail(request.getEmail());
            company.setPhone(request.getPhone());
            company.setIsActive(true);
            company.setSubscriptionPlan(request.getSubscriptionPlan() != null
                    ? request.getSubscriptionPlan()
                    : Company.SubscriptionPlan.BASIC);
            company.setSubscriptionExpiresAt(request.getSubscriptionExpiresAt());

            Company savedCompany = companyService.create(company);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedCompany));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cég frissítése.
     * PUT /api/companies/{id}
     * Body: UpdateCompanyRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCompanyRequest request) {
        try {
            Company companyDetails = new Company();
            companyDetails.setName(request.getName());
            companyDetails.setTaxNumber(request.getTaxNumber());
            companyDetails.setRegistrationNumber(request.getRegistrationNumber());
            companyDetails.setAddress(request.getAddress());
            companyDetails.setCity(request.getCity());
            companyDetails.setPostalCode(request.getPostalCode());
            companyDetails.setCountry(request.getCountry());
            companyDetails.setEmail(request.getEmail());
            companyDetails.setPhone(request.getPhone());
            companyDetails.setIsActive(request.getIsActive());
            companyDetails.setSubscriptionPlan(request.getSubscriptionPlan());
            companyDetails.setSubscriptionExpiresAt(request.getSubscriptionExpiresAt());

            Company updatedCompany = companyService.update(id, companyDetails);

            return ResponseEntity.ok(convertToResponse(updatedCompany));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Előfizetés meghosszabbítása.
     * PATCH /api/companies/{id}/subscription/extend?days=365
     */
    @PatchMapping("/{id}/subscription/extend")
    public ResponseEntity<Object> extendSubscription(
            @PathVariable Long id,
            @RequestParam int days) {
        try {
            Company company = companyService.extendSubscription(id, days);
            return ResponseEntity.ok(convertToResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Előfizetési csomag váltása.
     * PATCH /api/companies/{id}/subscription/plan?plan=PRO
     */
    @PatchMapping("/{id}/subscription/plan")
    public ResponseEntity<Object> changeSubscriptionPlan(
            @PathVariable Long id,
            @RequestParam Company.SubscriptionPlan plan) {
        try {
            Company company = companyService.changeSubscriptionPlan(id, plan);
            return ResponseEntity.ok(convertToResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cég deaktiválása (soft delete).
     * PATCH /api/companies/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivateCompany(@PathVariable Long id) {
        try {
            companyService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Company deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cég törlése (hard delete).
     * DELETE /api/companies/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCompany(@PathVariable Long id) {
        try {
            companyService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Company entitás konvertálása CompanyResponse DTO-vá.
     */
    private CompanyResponse convertToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getTaxNumber(),
                company.getRegistrationNumber(),
                company.getAddress(),
                company.getCity(),
                company.getPostalCode(),
                company.getCountry(),
                company.getEmail(),
                company.getPhone(),
                company.getIsActive(),
                company.getSubscriptionPlan(),
                company.getSubscriptionExpiresAt(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}
