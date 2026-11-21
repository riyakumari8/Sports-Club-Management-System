package com.clubsphere.shop.service;

import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.inventory.entity.Inventory;
import com.clubsphere.inventory.repository.InventoryRepository;
import com.clubsphere.shop.dto.ProductCreateDTO;
import com.clubsphere.shop.dto.ProductDTO;
import com.clubsphere.shop.entity.Product;
import com.clubsphere.shop.entity.ProductCategory;
import com.clubsphere.shop.repository.ProductCategoryRepository;
import com.clubsphere.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ProductService — Business logic service for managing sports shop products,
 * combining product details with real-time stock levels from Inventory.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    /**
     * Retrieves all products (both active and inactive) with current inventory information.
     *
     * @return List of ProductDTOs
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        log.debug("Fetching all products");
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return convertToDTOList(products);
    }

    /**
     * Retrieves all active products with current inventory information.
     *
     * @return List of active ProductDTOs
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getActiveProducts() {
        log.debug("Fetching active products");
        List<Product> products = productRepository.findByIsActiveTrue();
        return convertToDTOList(products);
    }

    /**
     * Retrieves a single product by its ID, including category and inventory details.
     *
     * @param id Product ID
     * @return ProductDTO
     * @throws ResourceNotFoundException if product not found
     */
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        log.debug("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return convertToDTO(product);
    }

    /**
     * Creates a new product and initializes an inventory record with 0 stock.
     *
     * @param dto Product creation details
     * @return Created ProductDTO
     * @throws ResourceNotFoundException if the specified category ID does not exist
     * @throws IllegalArgumentException  if price or discount inputs are invalid
     */
    public ProductDTO createProduct(ProductCreateDTO dto) {
        log.info("Creating new product: {}", dto.getName());

        ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", "id", dto.getCategoryId()));

        BigDecimal discount = dto.getDiscountPercent() != null ? dto.getDiscountPercent() : BigDecimal.ZERO;
        if (discount.compareTo(BigDecimal.ZERO) < 0 || discount.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
        }

        if (dto.getOriginalPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Original price must be greater than or equal to 0");
        }

        Product product = Product.builder()
                .category(category)
                .categoryId(category.getId())
                .name(dto.getName().trim())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .originalPrice(dto.getOriginalPrice())
                .discountPercent(discount)
                .isActive(true)
                .build();

        Product savedProduct = productRepository.save(product);
        log.info("Created product entity with id: {}", savedProduct.getId());

        // Initialize corresponding inventory entry if none exists
        if (!inventoryRepository.existsByProductId(savedProduct.getId())) {
            Inventory initialInventory = Inventory.builder()
                    .product(savedProduct)
                    .productId(savedProduct.getId())
                    .quantityInStock(0)
                    .minimumStockThreshold(5)
                    .stockStatus("OUT_OF_STOCK")
                    .lastUpdated(LocalDateTime.now())
                    .build();
            inventoryRepository.save(initialInventory);
            log.info("Initialized inventory record for product id: {}", savedProduct.getId());
        }

        return convertToDTO(savedProduct);
    }

    /**
     * Updates an existing product's details.
     *
     * @param id  Product ID to update
     * @param dto Updated product fields
     * @return Updated ProductDTO
     * @throws ResourceNotFoundException if product or category not found
     */
    public ProductDTO updateProduct(Long id, ProductCreateDTO dto) {
        log.info("Updating product with id: {}", id);

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", "id", dto.getCategoryId()));

        BigDecimal discount = dto.getDiscountPercent() != null ? dto.getDiscountPercent() : BigDecimal.ZERO;
        if (discount.compareTo(BigDecimal.ZERO) < 0 || discount.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
        }

        if (dto.getOriginalPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Original price must be greater than or equal to 0");
        }

        existing.setCategory(category);
        existing.setName(dto.getName().trim());
        existing.setDescription(dto.getDescription());
        existing.setImageUrl(dto.getImageUrl());
        existing.setOriginalPrice(dto.getOriginalPrice());
        existing.setDiscountPercent(discount);

        Product updatedProduct = productRepository.save(existing);
        log.info("Updated product successfully with id: {}", updatedProduct.getId());
        return convertToDTO(updatedProduct);
    }

    /**
     * Soft deletes a product by setting isActive to false.
     *
     * @param id Product ID to soft delete
     * @throws ResourceNotFoundException if product not found
     */
    public void deleteProduct(Long id) {
        log.info("Soft-deleting product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setIsActive(false);
        productRepository.save(product);
        log.info("Product id {} marked as inactive (soft deleted)", id);
    }

    /**
     * Dynamically searches products with optional keyword, category ID, price range, and sort order.
     *
     * @param keyword    Search term matching product name or description
     * @param categoryId Category ID filter
     * @param minPrice   Minimum selling price
     * @param maxPrice   Maximum selling price
     * @param sortBy     Sorting criteria (e.g., "price_asc", "price_desc", "name_asc", "name_desc", "newest")
     * @return List of matching ProductDTOs
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sortBy) {
        return searchProducts(keyword, categoryId, minPrice, maxPrice, null, sortBy);
    }

    /**
     * Dynamic search for products with full filter options including activeOnly.
     *
     * @param keyword    Keyword in name or description
     * @param categoryId Category ID filter
     * @param minPrice   Minimum price filter
     * @param maxPrice   Maximum price filter
     * @param activeOnly Filter for active products only (null = all)
     * @param sortBy     Sort field and direction
     * @return List of matching ProductDTOs
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                           Boolean activeOnly, String sortBy) {
        log.debug("Searching products with keyword='{}', categoryId={}, minPrice={}, maxPrice={}, activeOnly={}, sortBy='{}'",
                keyword, categoryId, minPrice, maxPrice, activeOnly, sortBy);

        String cleanedKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        Sort sort = buildSort(sortBy);

        List<Product> products = productRepository.searchProducts(
                cleanedKeyword,
                categoryId,
                minPrice,
                maxPrice,
                activeOnly,
                sort
        );

        return convertToDTOList(products);
    }

    /**
     * Helper method to map a Product entity and its real-time Inventory status to a ProductDTO.
     *
     * @param product The Product entity
     * @return Fully populated ProductDTO
     */
    public ProductDTO convertToDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductCategory category = product.getCategory();
        String categoryName = (category != null) ? category.getName() : null;
        Long categoryId = (category != null) ? category.getId() : product.getCategoryId();

        // Calculate selling price fallback if generated column is not yet loaded into entity
        BigDecimal sellingPrice = product.getSellingPrice();
        if (sellingPrice == null) {
            sellingPrice = product.calculateSellingPrice();
        }

        // Query real-time inventory
        Integer stockQuantity = 0;
        String stockStatus = "OUT_OF_STOCK";

        if (product.getId() != null) {
            Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(product.getId());
            if (inventoryOpt.isPresent()) {
                Inventory inventory = inventoryOpt.get();
                stockQuantity = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
                stockStatus = inventory.getStockStatus() != null ? inventory.getStockStatus() : "OUT_OF_STOCK";
            }
        }

        return ProductDTO.builder()
                .id(product.getId())
                .categoryId(categoryId)
                .categoryName(categoryName)
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .originalPrice(product.getOriginalPrice())
                .discountPercent(product.getDiscountPercent())
                .sellingPrice(sellingPrice)
                .isActive(product.getIsActive())
                .stockQuantity(stockQuantity)
                .stockStatus(stockStatus)
                .createdAt(product.getCreatedAt())
                .build();
    }

    /**
     * Converts a collection of Product entities to DTOs in bulk,
     * querying inventory in a single batch to avoid N+1 queries.
     *
     * @param products Collection of Product entities
     * @return List of ProductDTOs
     */
    public List<ProductDTO> convertToDTOList(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> productIds = products.stream()
                .map(Product::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Batch query all inventories for these products
        Map<Long, Inventory> inventoryMap = inventoryRepository.findByProductIdIn(productIds)
                .stream()
                .collect(Collectors.toMap(
                        Inventory::getProductId,
                        inv -> inv,
                        (existing, replacement) -> existing
                ));

        return products.stream()
                .map(product -> {
                    ProductCategory category = product.getCategory();
                    String categoryName = (category != null) ? category.getName() : null;
                    Long categoryId = (category != null) ? category.getId() : product.getCategoryId();

                    BigDecimal sellingPrice = product.getSellingPrice();
                    if (sellingPrice == null) {
                        sellingPrice = product.calculateSellingPrice();
                    }

                    Inventory inventory = inventoryMap.get(product.getId());
                    int stockQuantity = (inventory != null && inventory.getQuantityInStock() != null)
                            ? inventory.getQuantityInStock() : 0;
                    String stockStatus = (inventory != null && inventory.getStockStatus() != null)
                            ? inventory.getStockStatus() : "OUT_OF_STOCK";

                    return ProductDTO.builder()
                            .id(product.getId())
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .name(product.getName())
                            .description(product.getDescription())
                            .imageUrl(product.getImageUrl())
                            .originalPrice(product.getOriginalPrice())
                            .discountPercent(product.getDiscountPercent())
                            .sellingPrice(sellingPrice)
                            .isActive(product.getIsActive())
                            .stockQuantity(stockQuantity)
                            .stockStatus(stockStatus)
                            .createdAt(product.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Builds a Spring Data Sort object from a flexible sortBy parameter string.
     *
     * @param sortBy Sort string such as "price_asc", "price_desc", "name_asc", "newest"
     * @return Spring Data Sort instance
     */
    private Sort buildSort(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        String normalized = sortBy.trim().toLowerCase();
        return switch (normalized) {
            case "price_asc", "priceasc", "price,asc" -> Sort.by(Sort.Direction.ASC, "sellingPrice");
            case "price_desc", "pricedesc", "price,desc" -> Sort.by(Sort.Direction.DESC, "sellingPrice");
            case "name_asc", "nameasc", "name,asc", "name" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc", "namedesc", "name,desc" -> Sort.by(Sort.Direction.DESC, "name");
            case "newest", "latest", "created_desc" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "oldest", "created_asc" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "discount_desc", "discount" -> Sort.by(Sort.Direction.DESC, "discountPercent");
            default -> Sort.by(Sort.Direction.DESC, "id");
        };
    }
}
