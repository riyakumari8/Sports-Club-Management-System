package com.clubsphere.ecommerce.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.ecommerce.dto.CounterSaleDTO;
import com.clubsphere.ecommerce.dto.CounterSaleResponseDTO;
import com.clubsphere.ecommerce.service.CounterSaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop/counter-sales")
@RequiredArgsConstructor
public class CounterSaleController {

    private final CounterSaleService counterSaleService;

    @PostMapping
    public ResponseEntity<ApiResponse<CounterSaleResponseDTO>> createCounterSale(
            @Valid @RequestBody CounterSaleDTO dto) {
        CounterSaleResponseDTO sale = counterSaleService.createCounterSale(dto);
        return ResponseEntity.ok(ApiResponse.success("Counter sale completed", sale));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CounterSaleResponseDTO>>> getAllCounterSales() {
        List<CounterSaleResponseDTO> sales = counterSaleService.getAllCounterSales();
        return ResponseEntity.ok(ApiResponse.success("Counter sales retrieved", sales));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CounterSaleResponseDTO>> getCounterSaleById(@PathVariable Long id) {
        CounterSaleResponseDTO sale = counterSaleService.getCounterSaleById(id);
        return ResponseEntity.ok(ApiResponse.success("Counter sale retrieved", sale));
    }
}
