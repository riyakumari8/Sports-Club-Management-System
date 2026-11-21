package com.clubsphere.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.model.Promotion;
import com.clubsphere.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Promotions", description = "Public promotions, seasonal discounts and student deals")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    @Operation(summary = "Get all promotions with optional category and status filter")
    public ResponseEntity<ApiResponse<List<Promotion>>> getPromotions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {
        List<Promotion> list = promotionService.getAllPromotions(category, status);
        return ResponseEntity.ok(ApiResponse.success("Promotions retrieved", list));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active promotions only")
    public ResponseEntity<ApiResponse<List<Promotion>>> getActivePromotions() {
        List<Promotion> list = promotionService.getActivePromotions();
        return ResponseEntity.ok(ApiResponse.success("Active promotions retrieved", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get promotion by ID")
    public ResponseEntity<ApiResponse<Promotion>> getPromotionById(@PathVariable Long id) {
        Promotion promo = promotionService.getPromotionById(id);
        if (promo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.success("Promotion retrieved", promo));
    }
}
