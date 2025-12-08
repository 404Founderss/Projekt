package com.founders404.backend.service;

import com.founders404.backend.dto.ReorderPointDTO;
import com.founders404.backend.dto.StockForecastDTO;
import com.founders404.backend.model.Product;
import com.founders404.backend.repository.InventoryRepository;
import com.founders404.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    /**
     * Átlagos napi (OUT mozgás) az utolsó N napban (windowSize).
     */
    public BigDecimal calculateMovingAverage(Long productId, int windowSize) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(windowSize);
        List<Object[]> dailySales = inventoryRepository.findDailyOutMovements(productId, startDate);

        if (dailySales.isEmpty()) {
            return BigDecimal.ZERO;
        }

        double totalQuantity = dailySales.stream()
                .mapToDouble(row -> ((Number) row[1]).doubleValue())
                .sum();

        return BigDecimal.valueOf(totalQuantity / windowSize).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Stock elfogyásának prdikciója:.
     */
    public StockForecastDTO predictStockRunout(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int windowSize = 30; // 30 napos időtartam
        BigDecimal avgDailySales = calculateMovingAverage(productId, windowSize);
        Integer currentStock = product.getCurrentStock();

        int daysUntilStockout = 999; // Alap
        LocalDate estimatedDate = null;

        if (avgDailySales.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal days = BigDecimal.valueOf(currentStock).divide(avgDailySales, 0, RoundingMode.FLOOR);
            daysUntilStockout = days.intValue();
            estimatedDate = LocalDate.now().plusDays(daysUntilStockout);
        }

        return StockForecastDTO.builder()
                .productId(productId)
                .currentStock(currentStock)
                .averageDailySales(avgDailySales)
                .daysUntilStockout(daysUntilStockout)
                .estimatedStockoutDate(estimatedDate)
                .build();
    }

    /**
     * Úrjarendelési idő meghatározás.
     */
    public ReorderPointDTO calculateReorderPoint(Long productId, int leadTimeDays) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int windowSize = 30;
        BigDecimal avgDailySales = calculateMovingAverage(productId, windowSize);

        // Safety Stock: minStockLevel, else 0
        int safetyStock = product.getMinStockLevel() != null ? product.getMinStockLevel() : 0;

        BigDecimal reorderPointCalc = avgDailySales.multiply(BigDecimal.valueOf(leadTimeDays))
                .add(BigDecimal.valueOf(safetyStock));

        int reorderPoint = reorderPointCalc.setScale(0, RoundingMode.CEILING).intValue();

        return ReorderPointDTO.builder()
                .productId(productId)
                .leadTimeDays(leadTimeDays)
                .safetyStock(safetyStock)
                .reorderPoint(reorderPoint)
                .build();
    }

    /**
     * Előrejelzés a fontosabb termékeknek.
     */
    public List<StockForecastDTO> getCriticalStockPredictions() {
        List<Product> products = productRepository.findAll();
        List<StockForecastDTO> criticalProducts = new ArrayList<>();

        for (Product product : products) {
            if (!product.getIsActive()) continue;

            StockForecastDTO forecast = predictStockRunout(product.getId());
            // Define critical: e.g. stockout within 7 days
            if (forecast.getDaysUntilStockout() <= 7) {
                criticalProducts.add(forecast);
            }
        }
        return criticalProducts;
    }

    public List<ReorderPointDTO> getReorderRecommendations() {
        List<Product> products = productRepository.findAll();
        List<ReorderPointDTO> recommendations = new ArrayList<>();

        int defaultLeadTime = 7;

        for(Product product : products) {
            if(!product.getIsActive()) continue;

            ReorderPointDTO dto = calculateReorderPoint(product.getId(), defaultLeadTime);
            recommendations.add(dto);
        }
        return recommendations;
    }
}
