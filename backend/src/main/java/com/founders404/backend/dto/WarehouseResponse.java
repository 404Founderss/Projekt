package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponse {
    private Long id;
    private Long companyId;
    private String name;
    private String code;
    private String address;
    private String city;
    private String postalCode;
    private String country;
    private String email;
    private String phone;
    private Long managerId;
    private Boolean isActive;
    private Double capacity;
    private Double currentStock;
    private String unit;
    private String description;
    private String floorPlanData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ShelfResponse> shelves;
}
