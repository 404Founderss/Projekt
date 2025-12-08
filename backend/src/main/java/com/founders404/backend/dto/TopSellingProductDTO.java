package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingProductDTO {
    private Long productId;
    private String productName;
    private String sku;
    private Long totalSold;
}
