package com.clubsphere.cafe.controller;

import com.clubsphere.cafe.dto.*;
import com.clubsphere.cafe.service.CafeOrderService;
import com.clubsphere.cafe.service.CafePaymentService;
import com.clubsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafe/orders")
@RequiredArgsConstructor
public class CafeOrderController {

    private final CafeOrderService cafeOrderService;
    private final CafePaymentService cafePaymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CafeteriaOrderDTO>> createOrder(
            @Valid @RequestBody CreateCafeOrderDTO dto) {
        CafeteriaOrderDTO order = cafeOrderService.createOrder(dto);
        return ResponseEntity.ok(ApiResponse.success("Order placed", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CafeteriaOrderDTO>>> getAllOrders(
            @RequestParam(required = false) String status) {
        List<CafeteriaOrderDTO> orders = status != null
                ? cafeOrderService.getOrdersByStatus(status)
                : cafeOrderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CafeteriaOrderDTO>> getOrderById(@PathVariable Long id) {
        CafeteriaOrderDTO order = cafeOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved", order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CafeteriaOrderDTO>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody CafeOrderStatusUpdateDTO dto) {
        CafeteriaOrderDTO order = cafeOrderService.updateOrderStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    @GetMapping("/kitchen")
    public ResponseEntity<ApiResponse<List<CafeteriaOrderDTO>>> getKitchenOrders() {
        List<CafeteriaOrderDTO> orders = cafeOrderService.getKitchenOrders();
        return ResponseEntity.ok(ApiResponse.success("Kitchen orders retrieved", orders));
    }

    @PostMapping("/{id}/split-bill")
    public ResponseEntity<ApiResponse<List<BillSplitDTO>>> splitBill(
            @PathVariable Long id, @Valid @RequestBody SplitBillRequestDTO dto) {
        List<BillSplitDTO> splits = cafePaymentService.splitBill(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Bill split successfully", splits));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<CafeteriaPaymentDTO>> processPayment(
            @PathVariable Long id, @Valid @RequestBody CafeteriaPaymentDTO dto) {
        dto.setOrderId(id);
        CafeteriaPaymentDTO payment = cafePaymentService.processPayment(dto);
        return ResponseEntity.ok(ApiResponse.success("Payment processed", payment));
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<ApiResponse<List<CafeteriaPaymentDTO>>> getPayments(@PathVariable Long id) {
        List<CafeteriaPaymentDTO> payments = cafePaymentService.getPaymentsByOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", payments));
    }
}
