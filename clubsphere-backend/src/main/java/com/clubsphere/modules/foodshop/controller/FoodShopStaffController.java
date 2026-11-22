package com.clubsphere.modules.foodshop.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.foodshop.entity.*;
import com.clubsphere.modules.foodshop.service.FoodShopStaffService;
import com.clubsphere.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-shop")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@PreAuthorize("@staffSecurity.hasDepartment(authentication, 'FOOD_SHOP')")
@Tag(name = "Food Shop Staff", description = "Endpoints restricted to Food Shop & Cafe Department staff")
public class FoodShopStaffController {

    private final FoodShopStaffService foodShopStaffService;

    @GetMapping("/menu")
    @Operation(summary = "List cafe menu items with category, veg and search filters")
    public ResponseEntity<ApiResponse<List<FoodMenuItem>>> getMenuItems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Boolean isVeg,
            @RequestParam(required = false) String search
    ) {
        List<FoodMenuItem> list = foodShopStaffService.getMenuItems(categoryId, isVeg, search);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved", list));
    }

    @PatchMapping("/menu/{id}/availability")
    @Operation(summary = "Toggle menu item availability")
    public ResponseEntity<ApiResponse<FoodMenuItem>> toggleAvailability(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Boolean> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Boolean available = req != null ? req.get("isAvailable") : null;
        FoodMenuItem updated = foodShopStaffService.toggleAvailability(id, available, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Menu item availability updated to " + updated.getIsAvailable(), updated));
    }

    @PatchMapping("/menu/{id}")
    @Operation(summary = "Update menu item details (prep time, price, description)")
    public ResponseEntity<ApiResponse<FoodMenuItem>> updateMenuItem(
            @PathVariable Long id,
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        FoodMenuItem updated = foodShopStaffService.updateMenuItem(id, req, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", updated));
    }

    @GetMapping("/tables")
    @Operation(summary = "List cafe tables with live statuses (AVAILABLE, OCCUPIED, RESERVED, CLEANING)")
    public ResponseEntity<ApiResponse<List<FoodTable>>> getTables() {
        return ResponseEntity.ok(ApiResponse.success("Cafe tables retrieved", foodShopStaffService.getTables()));
    }

    @PatchMapping("/tables/{id}")
    @Operation(summary = "Update table status and order association")
    public ResponseEntity<ApiResponse<FoodTable>> updateTableStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> req
    ) {
        String status = req.get("status").toString();
        Long orderId = req.get("currentOrderId") != null ? Long.parseLong(req.get("currentOrderId").toString()) : null;
        FoodTable table = foodShopStaffService.updateTableStatus(id, status, orderId);
        return ResponseEntity.ok(ApiResponse.success("Table status updated to " + table.getStatus(), table));
    }

    @GetMapping("/orders")
    @Operation(summary = "List food orders with status and search filters (Kitchen queue & history)")
    public ResponseEntity<ApiResponse<List<FoodOrder>>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.success("Food orders retrieved", foodShopStaffService.getOrders(status, search)));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get food order details")
    public ResponseEntity<ApiResponse<FoodOrder>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Food order retrieved", foodShopStaffService.getOrderById(id)));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update kitchen workflow status (PENDING -> ACCEPTED -> PREPARING -> READY -> COMPLETED)")
    public ResponseEntity<ApiResponse<FoodOrder>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String newStatus = req.get("status");
        FoodOrder updated = foodShopStaffService.updateOrderStatus(id, newStatus, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Order transitioned to " + updated.getOrderStatus(), updated));
    }

    @GetMapping("/inventory")
    @Operation(summary = "View cafe kitchen ingredients inventory and stock movements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventory() {
        Map<String, Object> data = Map.of(
                "ingredients", foodShopStaffService.getIngredients(),
                "movements", foodShopStaffService.getRecentMovements()
        );
        return ResponseEntity.ok(ApiResponse.success("Food inventory retrieved", data));
    }

    @PostMapping("/inventory/adjustments")
    @Operation(summary = "Record ingredient usage, restock, or wastage")
    public ResponseEntity<ApiResponse<FoodInventoryMovement>> adjustIngredientStock(
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Long ingredientId = Long.parseLong(req.get("ingredientId").toString());
        BigDecimal quantity = new BigDecimal(req.get("quantity").toString());
        String movementType = (String) req.get("movementType");
        String reason = (String) req.get("reason");

        FoodInventoryMovement movement = foodShopStaffService.adjustIngredientStock(ingredientId, quantity, movementType, reason, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Ingredient stock adjusted", movement));
    }

    @PostMapping("/bills")
    @Operation(summary = "Create cafe bill and kitchen order with server-side membership discount")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createBill(
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Map<String, Object> bill = foodShopStaffService.createBill(req, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Bill generated and sent to kitchen", bill));
    }

    @GetMapping("/bills")
    @Operation(summary = "View cafe bills history")
    public ResponseEntity<ApiResponse<List<FoodBill>>> getBills() {
        return ResponseEntity.ok(ApiResponse.success("Bills retrieved", foodShopStaffService.getBills()));
    }

    @GetMapping("/reports/sales")
    @Operation(summary = "View cafe sales and operational summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesReport() {
        return ResponseEntity.ok(ApiResponse.success("Sales report retrieved", foodShopStaffService.getSalesReport()));
    }

    @GetMapping("/reports/preparation-times")
    @Operation(summary = "View kitchen preparation time and throughput metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPreparationTimesReport() {
        return ResponseEntity.ok(ApiResponse.success("Preparation times report retrieved", foodShopStaffService.getPreparationTimesReport()));
    }
}
