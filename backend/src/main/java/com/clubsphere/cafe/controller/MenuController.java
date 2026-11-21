package com.clubsphere.cafe.controller;

import com.clubsphere.cafe.dto.*;
import com.clubsphere.cafe.service.MenuService;
import com.clubsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafe/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuItems(
            @RequestParam(required = false) Long categoryId) {
        List<MenuItemDTO> items = menuService.getAllMenuItems(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved", items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDTO>> createMenuItem(
            @Valid @RequestBody MenuItemCreateDTO dto) {
        MenuItemDTO item = menuService.createMenuItem(dto);
        return ResponseEntity.ok(ApiResponse.success("Menu item created", item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateMenuItem(
            @PathVariable Long id, @Valid @RequestBody MenuItemCreateDTO dto) {
        MenuItemDTO item = menuService.updateMenuItem(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deactivateMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deactivated"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<MenuCategoryDTO>>> getCategories() {
        List<MenuCategoryDTO> categories = menuService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categories));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<MenuCategoryDTO>> createCategory(
            @Valid @RequestBody MenuCategoryDTO dto) {
        MenuCategoryDTO category = menuService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.success("Category created", category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<MenuCategoryDTO>> updateCategory(
            @PathVariable Long id, @Valid @RequestBody MenuCategoryDTO dto) {
        MenuCategoryDTO category = menuService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated", category));
    }
}
