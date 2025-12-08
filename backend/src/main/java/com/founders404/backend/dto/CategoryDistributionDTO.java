package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDistributionDTO {
    private String categoryName;
    private Long productCount;
    private BigDecimal totalStockValue;
}
