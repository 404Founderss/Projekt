package com.founders404.backend.controller;

import com.founders404.backend.dto.ReorderPointDTO;
import com.founders404.backend.dto.StockForecastDTO;
import com.founders404.backend.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping("/stock-forecast/{productId}")
    public ResponseEntity<StockForecastDTO> getStockForecast(@PathVariable Long productId) {
        return ResponseEntity.ok(predictionService.predictStockRunout(productId));
    }

    @GetMapping("/stock-forecast")
    public ResponseEntity<List<StockForecastDTO>> getCriticalStockForecasts() {
        return ResponseEntity.ok(predictionService.getCriticalStockPredictions());
    }

    @GetMapping("/reorder-recommendations")
    public ResponseEntity<List<ReorderPointDTO>> getReorderRecommendations() {
        return ResponseEntity.ok(predictionService.getReorderRecommendations());
    }
}
