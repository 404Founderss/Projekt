package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderPointDTO {
    private Long productId;
    private Integer leadTimeDays;
    private Integer safetyStock;
    private Integer reorderPoint;
}
