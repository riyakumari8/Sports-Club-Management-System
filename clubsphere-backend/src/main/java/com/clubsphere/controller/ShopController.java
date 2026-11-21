package com.clubsphere.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.model.ShopProduct;
import com.clubsphere.security.UserDetailsImpl;
import com.clubsphere.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Shops", description = "Pro Sports Accessory Shop and Sports Cafe Food & Beverage")
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/products")
    @Operation(summary = "Get all shop products with optional type, category, search filters")
    public ResponseEntity<ApiResponse<List<ShopProduct>>> getProducts(
            @RequestParam(required = false) String shopType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<ShopProduct> list = shopService.getProducts(shopType, category, search);
        return ResponseEntity.ok(ApiResponse.success("Shop products retrieved", list));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ShopProduct>> getProductById(@PathVariable Long id) {
        ShopProduct product = shopService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.success("Product retrieved", product));
    }

    @PostMapping("/order")
    @Operation(summary = "Place a simulated pickup order (Student authentication required)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> orderRequest
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Please login to place an order"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderReference", "CS-ORD-" + System.currentTimeMillis() % 1000000);
        response.put("studentEmail", userDetails.getUsername());
        response.put("status", "CONFIRMED");
        response.put("pickupLocation", "Pro Shop Counter / Sports Cafe Pickup Window");
        response.put("estimatedReadyTime", "15 minutes");

        return ResponseEntity.ok(ApiResponse.success("Order placed successfully! Present order reference at the counter.", response));
    }
}
