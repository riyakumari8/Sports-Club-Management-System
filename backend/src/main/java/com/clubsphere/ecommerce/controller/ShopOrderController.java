package com.clubsphere.ecommerce.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.ecommerce.dto.*;
import com.clubsphere.ecommerce.service.ShopOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop/orders")
@RequiredArgsConstructor
public class ShopOrderController {

    private final ShopOrderService shopOrderService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShopOrderDTO>> checkout(
            @RequestParam Long customerId,
            @Valid @RequestBody CheckoutDTO dto) {
        ShopOrderDTO order = shopOrderService.checkout(customerId, dto);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShopOrderDTO>>> getAllOrders(
            @RequestParam(required = false) String status) {
        List<ShopOrderDTO> orders = status != null
                ? shopOrderService.getOrdersByStatus(status)
                : shopOrderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopOrderDTO>> getOrderById(@PathVariable Long id) {
        ShopOrderDTO order = shopOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved", order));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<ShopOrderDTO>>> getOrdersByCustomer(@PathVariable Long customerId) {
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved", orders));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ShopOrderDTO>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO dto) {
        ShopOrderDTO order = shopOrderService.updateOrderStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ShopOrderDTO>> cancelOrder(@PathVariable Long id) {
        ShopOrderDTO order = shopOrderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", order));
    }
}
