package com.founders404.backend.dto;

import com.founders404.backend.model.Company;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String taxNumber;
    private String registrationNumber;
    private String address;
    private String city;
    private String postalCode;
    private String country;
    private String email;
    private String phone;
    private Boolean isActive;
    private Company.SubscriptionPlan subscriptionPlan;
    private LocalDate subscriptionExpiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
