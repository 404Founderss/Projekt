package com.founders404.backend.service;

import com.founders404.backend.dto.*;
import com.founders404.backend.model.Category;
import com.founders404.backend.model.InventoryMovement;
import com.founders404.backend.model.Product;
import com.founders404.backend.repository.CategoryRepository;
import com.founders404.backend.repository.InventoryRepository;
import com.founders404.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Top selling az össz eladás alapján.
     */
    public List<TopSellingProductDTO> getTopSellingProducts(int limit, Long companyId) {
        List<Object[]> results = inventoryRepository.findTopSellingProducts(companyId);

        return results.stream()
                .limit(limit)
                .map(row -> new TopSellingProductDTO(
                        (Long) row[0],
                        (String) row[1],
                        (String) row[2],
                        (Long) row[3]
                ))
                .collect(Collectors.toList());
    }

    public InventoryTurnoverDTO calculateInventoryTurnover(LocalDateTime startDate, LocalDateTime endDate, Long companyId) {
        Long totalGoodsSoldLong = inventoryRepository.calculateTotalGoodsSoldQuantity(startDate, endDate, companyId);
        double totalGoodsSold = totalGoodsSoldLong != null ? totalGoodsSoldLong.doubleValue() : 0.0;

        // Átlagos Inventory
        Long totalCurrentStock = productRepository.sumCurrentStock(companyId);
        if (totalCurrentStock == null) {
            totalCurrentStock = 0L;
        }

        double averageInventory = totalCurrentStock;

        BigDecimal turnoverRatio = BigDecimal.ZERO;
        if (averageInventory > 0) {
            turnoverRatio = BigDecimal.valueOf(totalGoodsSold / averageInventory);
        }

        return InventoryTurnoverDTO.builder()
                .totalGoodsSold(BigDecimal.valueOf(totalGoodsSold))
                .averageInventory(BigDecimal.valueOf(averageInventory))
                .turnoverRatio(turnoverRatio.setScale(2, RoundingMode.HALF_UP))
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    public FinancialStatsDTO calculateFinancialStats(LocalDateTime startDate, LocalDateTime endDate, Long companyId) {
        // Revenue: OUT movements * grossPrice
        BigDecimal revenue = inventoryRepository.calculateTotalRevenue(startDate, endDate, companyId);
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        // Cost: IN movements * netPrice
        BigDecimal cost = inventoryRepository.calculateTotalCost(startDate, endDate, companyId);
        if (cost == null) {
            cost = BigDecimal.ZERO;
        }

        BigDecimal profit = revenue.subtract(cost);

        return FinancialStatsDTO.builder()
                .revenue(revenue)
                .cost(cost)
                .profit(profit)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    public List<CategoryDistributionDTO> getCategoryDistribution(Long companyId) {
        List<Object[]> results = productRepository.findCategoryDistribution(companyId);

        List<Category> categories;
        if (companyId != null) {
            categories = categoryRepository.findByCompanyId(companyId);
        } else {
            categories = categoryRepository.findAll();
        }

        Map<Long, String> categoryNames = categories.stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        return results.stream()
                .map(row -> {
                    Long catId = (Long) row[0];
                    Long count = (Long) row[1];
                    BigDecimal value = (BigDecimal) row[2];
                    String catName = categoryNames.getOrDefault(catId, "Unknown");

                    return new CategoryDistributionDTO(catName, count, value);
                })
                .collect(Collectors.toList());
    }
}
