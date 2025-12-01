package com.founders404.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWarehouseRequest {

    @Size(max = 150, message = "Warehouse name must not exceed 150 characters")
    private String name;

    @Size(max = 50, message = "Warehouse code must not exceed 50 characters")
    private String code;

    private String address;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    private Long managerId;

    private Boolean isActive;

    @Min(value = 0, message = "Capacity must be greater than or equal to 0")
    private Double capacity;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    private String unit;

    private String description;

    /**
     * Alaprajz adatok JSON formátumban (Konva shapes).
     */
    private String floorPlanData;
}
