package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for shelf/wall response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShelfResponse {

    private Long id;
    private Long warehouseId;
    private String shapeId;
    private String type;
    private String code;
    private String name;
    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;
    private Double rotation;
    private Integer maxCapacity;
    private Integer currentUsage;
    private String capacityUnit;
    private Boolean isActive;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Calculated field: utilization percentage
     */
    private Double utilizationPercentage;

    /**
     * Calculated field: remaining capacity
     */
    private Integer remainingCapacity;
}
