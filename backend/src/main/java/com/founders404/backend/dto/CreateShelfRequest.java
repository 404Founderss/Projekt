package com.founders404.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating new shelf/wall.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateShelfRequest {

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    @Size(max = 100, message = "Shape ID must not exceed 100 characters")
    private String shapeId;

    @NotBlank(message = "Type is required (shelf or wall)")
    @Size(max = 20, message = "Type must not exceed 20 characters")
    private String type;

    @NotBlank(message = "Shelf code is required")
    @Size(max = 50, message = "Shelf code must not exceed 50 characters")
    private String code;

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Position X is required")
    private Double positionX;

    @NotNull(message = "Position Y is required")
    private Double positionY;

    @NotNull(message = "Width is required")
    @Min(value = 1, message = "Width must be at least 1")
    private Double width;

    @NotNull(message = "Height is required")
    @Min(value = 1, message = "Height must be at least 1")
    private Double height;

    private Double rotation;

    @Min(value = 0, message = "Max capacity must be non-negative")
    private Integer maxCapacity;

    @Size(max = 50, message = "Capacity unit must not exceed 50 characters")
    private String capacityUnit;

    private String notes;
}
