package com.clubsphere.modules.sportsshop.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.modules.sportsshop.entity.*;
import com.clubsphere.modules.sportsshop.service.SportsShopStaffService;
import com.clubsphere.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sports-shop")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@PreAuthorize("@staffSecurity.hasDepartment(authentication, 'SPORTS_SHOP')")
@Tag(name = "Sports Shop Staff", description = "Endpoints restricted to Sports Accessories Shop Department staff")
public class SportsShopStaffController {

    private final SportsShopStaffService sportsShopStaffService;

    @GetMapping("/products")
    @Operation(summary = "List sports products with search and category filters")
    public ResponseEntity<ApiResponse<List<SportsProduct>>> getProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search
    ) {
        List<SportsProduct> list = sportsShopStaffService.getProducts(categoryId, search);
        return ResponseEntity.ok(ApiResponse.success("Sports products retrieved", list));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get sports product details")
    public ResponseEntity<ApiResponse<SportsProduct>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product details retrieved", sportsShopStaffService.getProductById(id)));
    }

    @PatchMapping("/products/{id}")
    @Operation(summary = "Update sports product fields (price, reorder level, status)")
    public ResponseEntity<ApiResponse<SportsProduct>> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        SportsProduct updated = sportsShopStaffService.updateProduct(id, req, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @GetMapping("/inventory")
    @Operation(summary = "View inventory stock movements history")
    public ResponseEntity<ApiResponse<List<SportsInventoryMovement>>> getInventoryMovements() {
        return ResponseEntity.ok(ApiResponse.success("Inventory movements retrieved", sportsShopStaffService.getRecentMovements()));
    }

    @PostMapping("/inventory/adjustments")
    @Operation(summary = "Record stock movement / inventory adjustment")
    public ResponseEntity<ApiResponse<SportsInventoryMovement>> adjustStock(
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Long productId = Long.parseLong(req.get("productId").toString());
        Integer quantity = Integer.parseInt(req.get("quantity").toString());
        String movementType = (String) req.get("movementType");
        String reason = (String) req.get("reason");

        SportsInventoryMovement movement = sportsShopStaffService.adjustStock(productId, quantity, movementType, reason, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully", movement));
    }

    @GetMapping("/orders")
    @Operation(summary = "List sports orders with status and search filters")
    public ResponseEntity<ApiResponse<List<SportsOrder>>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.success("Sports orders retrieved", sportsShopStaffService.getOrders(status, search)));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get sports order details")
    public ResponseEntity<ApiResponse<SportsOrder>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details retrieved", sportsShopStaffService.getOrderById(id)));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update sports order workflow status (NEW -> ACCEPTED -> PACKING -> READY -> COMPLETED)")
    public ResponseEntity<ApiResponse<SportsOrder>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String newStatus = req.get("status");
        String notes = req.get("notes");
        SportsOrder updated = sportsShopStaffService.updateOrderStatus(id, newStatus, notes, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + updated.getOrderStatus(), updated));
    }

    @PostMapping("/counter-sales")
    @Operation(summary = "Process in-store counter POS sale with server-side discount and stock deduction")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCounterSale(
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Map<String, Object> sale = sportsShopStaffService.createCounterSale(req, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Counter sale completed and receipt generated", sale));
    }

    @GetMapping("/returns")
    @Operation(summary = "List sports shop returns and exchange requests")
    public ResponseEntity<ApiResponse<List<SportsReturn>>> getReturns() {
        return ResponseEntity.ok(ApiResponse.success("Returns retrieved", sportsShopStaffService.getReturns()));
    }

    @PostMapping("/returns/{id}/review")
    @Operation(summary = "Review and process return / exchange request")
    public ResponseEntity<ApiResponse<SportsReturn>> reviewReturn(
            @PathVariable Long id,
            @RequestBody Map<String, String> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String status = req.get("status");
        String condition = req.get("condition");
        String notes = req.get("notes");
        SportsReturn reviewed = sportsShopStaffService.reviewReturn(id, status, condition, notes, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Return status updated", reviewed));
    }

    @GetMapping("/reports/sales")
    @Operation(summary = "View sports accessories sales and inventory report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesReport() {
        return ResponseEntity.ok(ApiResponse.success("Sales report retrieved", sportsShopStaffService.getSalesReport()));
    }

    @GetMapping("/bookings")
    @Operation(summary = "View equipment rentals and relevant activity bookings (Read-only)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSportsBookings() {
        List<Map<String, Object>> list = List.of(
                Map.of(
                        "bookingId", "EQ-RENT-101",
                        "customerName", "Devendra Singh",
                        "equipment", "Wilson Pro Staff Racket (Demo Rental)",
                        "court", "Center Tennis Court #1",
                        "slot", "17:00 - 18:00",
                        "status", "RESERVED_FOR_PICKUP",
                        "depositPaid", true
                ),
                Map.of(
                        "bookingId", "EQ-RENT-102",
                        "customerName", "Pooja Reddy",
                        "equipment", "Yonex Astrox 88D + 2 Shuttles",
                        "court", "Indoor Badminton Court #3",
                        "slot", "18:00 - 19:00",
                        "status", "RETURNED_INSPECTED",
                        "depositPaid", true
                )
        );
        return ResponseEntity.ok(ApiResponse.success("Equipment bookings retrieved", list));
    }
}
