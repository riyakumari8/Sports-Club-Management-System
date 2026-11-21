package com.clubsphere.inventory.service;

import com.clubsphere.common.exception.InsufficientStockException;
import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.inventory.dto.*;
import com.clubsphere.inventory.entity.Inventory;
import com.clubsphere.inventory.entity.StockMovement;
import com.clubsphere.inventory.enums.MovementType;
import com.clubsphere.inventory.repository.InventoryRepository;
import com.clubsphere.inventory.repository.StockMovementRepository;
import com.clubsphere.shop.entity.Product;
import com.clubsphere.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * InventoryService — Handles inventory stock tracking, adjustments, stock-in,
 * stock deduction, and stock movement auditing.
 * 
 * Uses pessimistic locking on deductStock and stock modifications to ensure concurrent
 * checkouts and POS counter sales maintain inventory consistency.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    /**
     * Checks how much stock is currently available for a product.
     *
     * @param productId Product ID
     * @return Quantity in stock (0 if no record exists)
     */
    @Transactional(readOnly = true)
    public int getAvailableStock(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(Inventory::getQuantityInStock)
                .orElse(0);
    }

    /**
     * Verifies if the requested quantity is available in stock.
     */
    @Transactional(readOnly = true)
    public boolean isStockAvailable(Long productId, int quantity) {
        return getAvailableStock(productId) >= quantity;
    }

    /**
     * Deducts stock for a product using a pessimistic write lock.
     * Throws InsufficientStockException if requested quantity exceeds current stock.
     *
     * @param productId Product ID
     * @param quantity  Amount of stock to deduct (must be > 0)
     */
    @Transactional
    public void deductStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to deduct must be greater than zero");
        }

        log.debug("Acquiring pessimistic lock to deduct {} units for product {}", quantity, productId);

        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for product ID: " + productId));

        if (inventory.getQuantityInStock() < quantity) {
            throw new InsufficientStockException(
                    String.format("Insufficient stock for product ID %d. Available: %d, Requested: %d",
                            productId, inventory.getQuantityInStock(), quantity)
            );
        }

        int previousStock = inventory.getQuantityInStock();
        int updatedStock = previousStock - quantity;
        inventory.setQuantityInStock(updatedStock);
        inventoryRepository.save(inventory);

        log.info("Deducted {} units for product {}. Remaining stock: {}", quantity, productId, updatedStock);
    }

    /**
     * Restores stock for a product (e.g., when an order is cancelled).
     *
     * @param productId Product ID
     * @param quantity  Amount of stock to return (must be > 0)
     */
    @Transactional
    public void returnStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to return must be greater than zero");
        }

        log.debug("Acquiring pessimistic lock to return {} units for product {}", quantity, productId);

        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseGet(() -> Inventory.builder()
                        .productId(productId)
                        .quantityInStock(0)
                        .minimumStockThreshold(5)
                        .build());

        int previousStock = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
        int updatedStock = previousStock + quantity;
        inventory.setQuantityInStock(updatedStock);
        inventoryRepository.save(inventory);

        log.info("Returned {} units for product {}. Updated stock: {}", quantity, productId, updatedStock);
    }

    /**
     * Retrieves all inventory items with product details and real-time status.
     *
     * @return List of InventoryDTO
     */
    @Transactional(readOnly = true)
    public List<InventoryDTO> getAllInventory() {
        log.debug("Fetching all inventory records");
        return inventoryRepository.findAll().stream()
                .map(this::mapToInventoryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves inventory details for a specific product.
     *
     * @param productId Product ID
     * @return InventoryDTO
     */
    @Transactional(readOnly = true)
    public InventoryDTO getByProductId(Long productId) {
        log.debug("Fetching inventory record for productId: {}", productId);
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for product ID: " + productId));
        return mapToInventoryDTO(inventory);
    }

    /**
     * Adds incoming stock for a product and logs a STOCK_IN movement.
     *
     * @param dto StockInDTO containing productId, quantity, and reason
     * @return Updated InventoryDTO
     */
    @Transactional
    public InventoryDTO stockIn(StockInDTO dto) {
        log.info("Adding {} units to product {}", dto.getQuantity(), dto.getProductId());

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + dto.getProductId()));

        Inventory inventory = inventoryRepository.findByProductIdWithLock(dto.getProductId())
                .orElseGet(() -> Inventory.builder()
                        .productId(dto.getProductId())
                        .product(product)
                        .quantityInStock(0)
                        .minimumStockThreshold(5)
                        .build());

        int previousStock = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
        int updatedStock = previousStock + dto.getQuantity();

        inventory.setQuantityInStock(updatedStock);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory savedInventory = inventoryRepository.save(inventory);

        StockMovement movement = StockMovement.builder()
                .productId(dto.getProductId())
                .product(product)
                .recordedBy(dto.getRecordedBy())
                .movementType(MovementType.STOCK_IN.name())
                .quantity(dto.getQuantity())
                .previousStock(previousStock)
                .updatedStock(updatedStock)
                .reason(dto.getReason() != null ? dto.getReason() : "Stock In")
                .createdAt(LocalDateTime.now())
                .build();
        stockMovementRepository.save(movement);

        log.info("StockIn successful for product {}. Previous: {}, Updated: {}",
                dto.getProductId(), previousStock, updatedStock);

        return mapToInventoryDTO(savedInventory);
    }

    /**
     * Manually adjusts inventory stock and logs an ADJUSTMENT movement.
     *
     * @param dto StockAdjustDTO containing productId, newQuantity, and reason
     * @return Updated InventoryDTO
     */
    @Transactional
    public InventoryDTO adjustStock(StockAdjustDTO dto) {
        log.info("Adjusting stock for product {} to {} units", dto.getProductId(), dto.getNewQuantity());

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + dto.getProductId()));

        Inventory inventory = inventoryRepository.findByProductIdWithLock(dto.getProductId())
                .orElseGet(() -> Inventory.builder()
                        .productId(dto.getProductId())
                        .product(product)
                        .quantityInStock(0)
                        .minimumStockThreshold(5)
                        .build());

        int previousStock = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
        int updatedStock = dto.getNewQuantity();
        int diff = updatedStock - previousStock;

        inventory.setQuantityInStock(updatedStock);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory savedInventory = inventoryRepository.save(inventory);

        StockMovement movement = StockMovement.builder()
                .productId(dto.getProductId())
                .product(product)
                .recordedBy(dto.getRecordedBy())
                .movementType(MovementType.ADJUSTMENT.name())
                .quantity(Math.abs(diff))
                .previousStock(previousStock)
                .updatedStock(updatedStock)
                .reason(dto.getReason() != null ? dto.getReason() : "Stock Adjustment")
                .createdAt(LocalDateTime.now())
                .build();
        stockMovementRepository.save(movement);

        log.info("AdjustStock successful for product {}. Previous: {}, Updated: {}",
                dto.getProductId(), previousStock, updatedStock);

        return mapToInventoryDTO(savedInventory);
    }

    /**
     * Retrieves all products with stock status LOW_STOCK or OUT_OF_STOCK,
     * or where quantityInStock <= minimumStockThreshold.
     *
     * @return List of LowStockAlertDTO
     */
    @Transactional(readOnly = true)
    public List<LowStockAlertDTO> getLowStockAlerts() {
        log.debug("Fetching low stock alerts");
        return inventoryRepository.findAll().stream()
                .filter(inv -> {
                    int qty = inv.getQuantityInStock() != null ? inv.getQuantityInStock() : 0;
                    int threshold = inv.getMinimumStockThreshold() != null ? inv.getMinimumStockThreshold() : 5;
                    String status = inv.getStockStatus();
                    return qty <= threshold || "LOW_STOCK".equalsIgnoreCase(status) || "OUT_OF_STOCK".equalsIgnoreCase(status);
                })
                .map(inv -> {
                    String productName = null;
                    if (inv.getProduct() != null) {
                        productName = inv.getProduct().getName();
                    } else if (inv.getProductId() != null) {
                        productName = productRepository.findById(inv.getProductId())
                                .map(Product::getName)
                                .orElse(null);
                    }
                    return LowStockAlertDTO.builder()
                            .productId(inv.getProductId())
                            .productName(productName)
                            .currentStock(inv.getQuantityInStock())
                            .minimumStock(inv.getMinimumStockThreshold())
                            .stockStatus(inv.getStockStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all stock movements across all products, ordered newest first.
     *
     * @return List of StockMovementDTO
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getAllMovements() {
        log.debug("Fetching all stock movements");
        return stockMovementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToStockMovementDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all stock movements for a specific product, ordered newest first.
     *
     * @param productId Product ID
     * @return List of StockMovementDTO
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getMovementsByProduct(Long productId) {
        log.debug("Fetching stock movements for productId: {}", productId);
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToStockMovementDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to map Inventory entity to InventoryDTO.
     */
    private InventoryDTO mapToInventoryDTO(Inventory inventory) {
        String productName = null;
        String categoryName = null;

        if (inventory.getProduct() != null) {
            Product product = inventory.getProduct();
            productName = product.getName();
            if (product.getCategory() != null) {
                categoryName = product.getCategory().getName();
            }
        } else if (inventory.getProductId() != null) {
            Optional<Product> productOpt = productRepository.findById(inventory.getProductId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                productName = product.getName();
                if (product.getCategory() != null) {
                    categoryName = product.getCategory().getName();
                }
            }
        }

        return InventoryDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .productName(productName)
                .categoryName(categoryName)
                .quantityInStock(inventory.getQuantityInStock())
                .minimumStockThreshold(inventory.getMinimumStockThreshold())
                .stockStatus(inventory.getStockStatus())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    /**
     * Helper method to map StockMovement entity to StockMovementDTO.
     */
    private StockMovementDTO mapToStockMovementDTO(StockMovement movement) {
        String productName = null;

        if (movement.getProduct() != null) {
            productName = movement.getProduct().getName();
        } else if (movement.getProductId() != null) {
            productName = productRepository.findById(movement.getProductId())
                    .map(Product::getName)
                    .orElse(null);
        }

        return StockMovementDTO.builder()
                .id(movement.getId())
                .productId(movement.getProductId())
                .productName(productName)
                .movementType(movement.getMovementType())
                .quantity(movement.getQuantity())
                .previousStock(movement.getPreviousStock())
                .updatedStock(movement.getUpdatedStock())
                .reason(movement.getReason())
                .recordedBy(movement.getRecordedBy())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
