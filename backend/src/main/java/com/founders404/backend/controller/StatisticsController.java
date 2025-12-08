package com.founders404.backend.controller;

import com.founders404.backend.dto.*;
import com.founders404.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/top-selling")
    public ResponseEntity<List<TopSellingProductDTO>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long companyId) {
        return ResponseEntity.ok(statisticsService.getTopSellingProducts(limit, companyId));
    }

    @GetMapping("/inventory-turnover")
    public ResponseEntity<InventoryTurnoverDTO> getInventoryTurnover(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long companyId) {
        return ResponseEntity.ok(statisticsService.calculateInventoryTurnover(startDate, endDate, companyId));
    }

    @GetMapping("/revenue")
    public ResponseEntity<FinancialStatsDTO> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long companyId) {
        FinancialStatsDTO stats = statisticsService.calculateFinancialStats(startDate, endDate, companyId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/profit")
    public ResponseEntity<FinancialStatsDTO> getProfit(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long companyId) {
        return ResponseEntity.ok(statisticsService.calculateFinancialStats(startDate, endDate, companyId));
    }

    @GetMapping("/category-distribution")
    public ResponseEntity<List<CategoryDistributionDTO>> getCategoryDistribution(
            @RequestParam(required = false) Long companyId) {
        return ResponseEntity.ok(statisticsService.getCategoryDistribution(companyId));
    }
}
