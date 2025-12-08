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
public class FinancialStatsDTO {
    private BigDecimal revenue;
    private BigDecimal cost;
    private BigDecimal profit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
