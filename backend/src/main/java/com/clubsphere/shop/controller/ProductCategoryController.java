package com.clubsphere.shop.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.shop.dto.ProductCategoryDTO;
import com.clubsphere.shop.service.ProductCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ProductCategoryController — REST Controller for product category operations in the Sports Shop.
 *
 * Base URL: /api/products/categories
 */
@Slf4j
@RestController
@RequestMapping("/api/products/categories")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService categoryService;

    /**
     * GET /api/products/categories
     * Retrieves all product categories.
     *
     * @return ApiResponse containing list of all category DTOs
     */
    @GetMapping({"", "/"})
    public ResponseEntity<ApiResponse<List<ProductCategoryDTO>>> getAllCategories() {
        log.info("REST request to get all product categories");
        List<ProductCategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    /**
     * GET /api/products/categories/active
     * Retrieves only currently active product categories.
     *
     * @return ApiResponse containing list of active category DTOs
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductCategoryDTO>>> getActiveCategories() {
        log.info("REST request to get active product categories");
        List<ProductCategoryDTO> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success("Active categories retrieved successfully", categories));
    }

    /**
     * GET /api/products/categories/{id}
     * Retrieves a single product category by its ID.
     *
     * @param id Category ID
     * @return ApiResponse containing the category DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductCategoryDTO>> getCategoryById(@PathVariable Long id) {
        log.info("REST request to get product category with id: {}", id);
        ProductCategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", category));
    }

    /**
     * POST /api/products/categories
     * Creates a new product category.
     *
     * @param dto ProductCategoryDTO containing category name and description
     * @return ApiResponse containing created category DTO with HTTP 201 Created
     */
    @PostMapping({"", "/"})
    public ResponseEntity<ApiResponse<ProductCategoryDTO>> createCategory(@Valid @RequestBody ProductCategoryDTO dto) {
        log.info("REST request to create product category: {}", dto.getName());
        ProductCategoryDTO created = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", created));
    }

    /**
     * PUT /api/products/categories/{id}
     * Updates an existing product category.
     *
     * @param id  Category ID to update
     * @param dto Updated category fields
     * @return ApiResponse containing updated category DTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductCategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ProductCategoryDTO dto) {
        log.info("REST request to update product category with id: {}", id);
        ProductCategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    /**
     * PATCH /api/products/categories/{id}/toggle
     * Toggles a category between active and inactive states.
     *
     * @param id Category ID to toggle
     * @return ApiResponse containing updated category DTO
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<ProductCategoryDTO>> toggleCategory(@PathVariable Long id) {
        log.info("REST request to toggle active status for category id: {}", id);
        ProductCategoryDTO updated = categoryService.toggleCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category status updated successfully", updated));
    }
}
