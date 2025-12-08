package com.founders404.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTurnoverDTO {
    private BigDecimal totalGoodsSold;
    private BigDecimal averageInventory;
    private BigDecimal turnoverRatio;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
