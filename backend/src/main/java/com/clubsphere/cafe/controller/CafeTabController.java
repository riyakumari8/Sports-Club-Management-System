package com.clubsphere.cafe.controller;

import com.clubsphere.cafe.dto.CafeteriaTabDTO;
import com.clubsphere.cafe.service.CafeTabService;
import com.clubsphere.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafe/tabs")
@RequiredArgsConstructor
public class CafeTabController {

    private final CafeTabService cafeTabService;

    @PostMapping
    public ResponseEntity<ApiResponse<CafeteriaTabDTO>> openTab(
            @RequestParam Long tableId,
            @RequestParam(required = false) Long customerId) {
        CafeteriaTabDTO tab = cafeTabService.openTab(tableId, customerId);
        return ResponseEntity.ok(ApiResponse.success("Tab opened", tab));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CafeteriaTabDTO>> getTab(@PathVariable Long id) {
        CafeteriaTabDTO tab = cafeTabService.getTab(id);
        return ResponseEntity.ok(ApiResponse.success("Tab retrieved", tab));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<CafeteriaTabDTO>> closeTab(@PathVariable Long id) {
        CafeteriaTabDTO tab = cafeTabService.closeTab(id);
        return ResponseEntity.ok(ApiResponse.success("Tab closed", tab));
    }

    @GetMapping("/open")
    public ResponseEntity<ApiResponse<List<CafeteriaTabDTO>>> getOpenTabs() {
        List<CafeteriaTabDTO> tabs = cafeTabService.getOpenTabs();
        return ResponseEntity.ok(ApiResponse.success("Open tabs retrieved", tabs));
    }
}
