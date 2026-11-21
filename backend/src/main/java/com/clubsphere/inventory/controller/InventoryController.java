package com.clubsphere.inventory.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.inventory.dto.*;
import com.clubsphere.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * InventoryController — REST Controller for inventory management, stock adjustments,
 * low-stock monitoring, and stock movement auditing.
 *
 * Base URL: /api/inventory
 */
@Slf4j
@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * GET /api/inventory
     * Retrieves all inventory items with product details and stock status.
     *
     * @return ApiResponse containing list of InventoryDTO
     */
    @GetMapping({"", "/"})
    public ApiResponse<List<InventoryDTO>> getAllInventory() {
        log.info("REST request to get all inventory items");
        List<InventoryDTO> inventoryList = inventoryService.getAllInventory();
        return ApiResponse.success("Inventory retrieved successfully", inventoryList);
    }

    /**
     * GET /api/inventory/{productId}
     * Retrieves inventory details for a specific product.
     *
     * @param productId The ID of the product
     * @return ApiResponse containing InventoryDTO
     */
    @GetMapping("/{productId}")
    public ApiResponse<InventoryDTO> getByProductId(@PathVariable Long productId) {
        log.info("REST request to get inventory for product ID: {}", productId);
        InventoryDTO inventoryDTO = inventoryService.getByProductId(productId);
        return ApiResponse.success("Inventory retrieved successfully", inventoryDTO);
    }

    /**
     * POST /api/inventory/stock-in
     * Adds incoming stock for a product and logs a STOCK_IN movement.
     *
     * @param dto StockInDTO containing productId, quantity, and reason
     * @return ApiResponse containing updated InventoryDTO
     */
    @PostMapping("/stock-in")
    public ApiResponse<InventoryDTO> stockIn(@RequestBody @Valid StockInDTO dto) {
        log.info("REST request to add stock: productId={}, quantity={}, reason={}",
                dto.getProductId(), dto.getQuantity(), dto.getReason());
        InventoryDTO updatedInventory = inventoryService.stockIn(dto);
        return ApiResponse.success("Stock added successfully", updatedInventory);
    }

    /**
     * POST /api/inventory/adjust
     * Manually adjusts stock quantity (for audit/reconciliation) and logs an ADJUSTMENT movement.
     *
     * @param dto StockAdjustDTO containing productId, newQuantity, and reason
     * @return ApiResponse containing updated InventoryDTO
     */
    @PostMapping("/adjust")
    public ApiResponse<InventoryDTO> adjustStock(@RequestBody @Valid StockAdjustDTO dto) {
        log.info("REST request to adjust stock: productId={}, newQuantity={}, reason={}",
                dto.getProductId(), dto.getNewQuantity(), dto.getReason());
        InventoryDTO updatedInventory = inventoryService.adjustStock(dto);
        return ApiResponse.success("Stock adjusted successfully", updatedInventory);
    }

    /**
     * GET /api/inventory/low-stock
     * Retrieves all products that are low on stock or out of stock.
     *
     * @return ApiResponse containing list of LowStockAlertDTO
     */
    @GetMapping("/low-stock")
    public ApiResponse<List<LowStockAlertDTO>> getLowStockAlerts() {
        log.info("REST request to get low stock alerts");
        List<LowStockAlertDTO> alerts = inventoryService.getLowStockAlerts();
        return ApiResponse.success("Low stock alerts retrieved successfully", alerts);
    }

    /**
     * GET /api/inventory/movements
     * Retrieves all stock movements across all products, ordered newest first.
     *
     * @return ApiResponse containing list of StockMovementDTO
     */
    @GetMapping("/movements")
    public ApiResponse<List<StockMovementDTO>> getAllMovements() {
        log.info("REST request to get all stock movements");
        List<StockMovementDTO> movements = inventoryService.getAllMovements();
        return ApiResponse.success("Stock movements retrieved successfully", movements);
    }

    /**
     * GET /api/inventory/movements/{productId}
     * Retrieves all stock movements for a specific product, ordered newest first.
     *
     * @param productId The ID of the product
     * @return ApiResponse containing list of StockMovementDTO
     */
    @GetMapping("/movements/{productId}")
    public ApiResponse<List<StockMovementDTO>> getMovementsByProduct(@PathVariable Long productId) {
        log.info("REST request to get stock movements for product ID: {}", productId);
        List<StockMovementDTO> movements = inventoryService.getMovementsByProduct(productId);
        return ApiResponse.success("Stock movements retrieved successfully", movements);
    }
}
