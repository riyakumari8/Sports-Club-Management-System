package com.clubsphere.shop.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.shop.dto.ProductCreateDTO;
import com.clubsphere.shop.dto.ProductDTO;
import com.clubsphere.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * ProductController — REST Controller for managing sports shop products.
 *
 * Base URL: /api/products
 * Provides endpoints for searching, listing, retrieving, creating, updating, and soft-deleting products.
 */
@Slf4j
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products
     * Retrieves all products or filtered products when query parameters are supplied.
     *
     * @param keyword    Optional search term matching product name or description
     * @param categoryId Optional filter by category ID
     * @param minPrice   Optional minimum selling price filter
     * @param maxPrice   Optional maximum selling price filter
     * @param sortBy     Optional sort criteria ("price_asc", "price_desc", "name_asc", "newest")
     * @return ApiResponse containing list of ProductDTOs
     */
    @GetMapping({"", "/"})
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy) {

        log.info("REST request to list/search products with keyword='{}', categoryId={}, minPrice={}, maxPrice={}, sortBy='{}'",
                keyword, categoryId, minPrice, maxPrice, sortBy);

        List<ProductDTO> products;
        if (keyword == null && categoryId == null && minPrice == null && maxPrice == null && sortBy == null) {
            products = productService.getAllProducts();
        } else {
            products = productService.searchProducts(keyword, categoryId, minPrice, maxPrice, sortBy);
        }

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    /**
     * GET /api/products/active
     * Retrieves only currently active products.
     *
     * @return ApiResponse containing list of active ProductDTOs
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getActiveProducts() {
        log.info("REST request to get active products");
        List<ProductDTO> products = productService.getActiveProducts();
        return ResponseEntity.ok(ApiResponse.success("Active products retrieved successfully", products));
    }

    /**
     * GET /api/products/{id}
     * Retrieves a single product by its ID with full category and inventory details.
     *
     * @param id Product ID
     * @return ApiResponse containing ProductDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getById(@PathVariable Long id) {
        log.info("REST request to get product with id: {}", id);
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    /**
     * POST /api/products
     * Creates a new product and initializes an inventory record.
     *
     * @param dto Product creation request payload
     * @return ApiResponse containing created ProductDTO with HTTP 201 Created
     */
    @PostMapping({"", "/"})
    public ResponseEntity<ApiResponse<ProductDTO>> create(@Valid @RequestBody ProductCreateDTO dto) {
        log.info("REST request to create product: {}", dto.getName());
        ProductDTO created = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", created));
    }

    /**
     * PUT /api/products/{id}
     * Updates an existing product.
     *
     * @param id  Product ID to update
     * @param dto Product update request payload
     * @return ApiResponse containing updated ProductDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO dto) {
        log.info("REST request to update product with id: {}", id);
        ProductDTO updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    /**
     * DELETE /api/products/{id}
     * Soft deletes a product (sets isActive to false).
     *
     * @param id Product ID to soft delete
     * @return ApiResponse with confirmation message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        log.info("REST request to soft delete product with id: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }
}
