package com.founders404.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating shelf/wall.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShelfRequest {

    @Size(max = 100, message = "Shape ID must not exceed 100 characters")
    private String shapeId;

    @Size(max = 20, message = "Type must not exceed 20 characters")
    private String type;

    @Size(max = 50, message = "Shelf code must not exceed 50 characters")
    private String code;

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Min(value = 0, message = "Position X must be non-negative")
    private Double positionX;

    @Min(value = 0, message = "Position Y must be non-negative")
    private Double positionY;

    @Min(value = 1, message = "Width must be at least 1")
    private Double width;

    @Min(value = 1, message = "Height must be at least 1")
    private Double height;

    private Double rotation;

    @Min(value = 0, message = "Max capacity must be non-negative")
    private Integer maxCapacity;

    @Min(value = 0, message = "Current usage must be non-negative")
    private Integer currentUsage;

    @Size(max = 50, message = "Capacity unit must not exceed 50 characters")
    private String capacityUnit;

    private Boolean isActive;

    private String notes;
}
