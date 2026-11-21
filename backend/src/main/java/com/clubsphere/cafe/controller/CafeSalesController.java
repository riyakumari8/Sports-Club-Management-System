package com.clubsphere.cafe.controller;

import com.clubsphere.cafe.dto.DailySalesDTO;
import com.clubsphere.cafe.service.CafeDailySalesService;
import com.clubsphere.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/cafe/sales")
@RequiredArgsConstructor
public class CafeSalesController {

    private final CafeDailySalesService dailySalesService;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<DailySalesDTO>> getDailySales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailySalesDTO sales = dailySalesService.getDailySales(date);
        return ResponseEntity.ok(ApiResponse.success("Daily sales retrieved", sales));
    }
}
