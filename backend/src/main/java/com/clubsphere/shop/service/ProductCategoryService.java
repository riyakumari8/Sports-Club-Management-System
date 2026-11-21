package com.clubsphere.shop.service;

import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.shop.dto.ProductCategoryDTO;
import com.clubsphere.shop.entity.ProductCategory;
import com.clubsphere.shop.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductCategoryService — Business logic service for managing product categories in the Sports Shop.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

    /**
     * Retrieves all product categories (both active and inactive).
     *
     * @return List of all category DTOs
     */
    @Transactional(readOnly = true)
    public List<ProductCategoryDTO> getAllCategories() {
        log.debug("Fetching all product categories");
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves only currently active product categories.
     *
     * @return List of active category DTOs
     */
    @Transactional(readOnly = true)
    public List<ProductCategoryDTO> getActiveCategories() {
        log.debug("Fetching active product categories");
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single category by its ID.
     *
     * @param id Category ID
     * @return ProductCategoryDTO
     * @throws ResourceNotFoundException if no category with the given ID exists
     */
    @Transactional(readOnly = true)
    public ProductCategoryDTO getCategoryById(Long id) {
        log.debug("Fetching product category with id: {}", id);
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", "id", id));
        return convertToDTO(category);
    }

    /**
     * Creates a new product category.
     *
     * @param dto ProductCategoryDTO containing category name and description
     * @return Created ProductCategoryDTO
     * @throws IllegalArgumentException if a category with the same name already exists
     */
    public ProductCategoryDTO createCategory(ProductCategoryDTO dto) {
        log.info("Creating new product category with name: {}", dto.getName());

        if (categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new IllegalArgumentException("Category with name '" + dto.getName().trim() + "' already exists");
        }

        ProductCategory category = ProductCategory.builder()
                .name(dto.getName().trim())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        ProductCategory savedCategory = categoryRepository.save(category);
        log.info("Created product category successfully with id: {}", savedCategory.getId());
        return convertToDTO(savedCategory);
    }

    /**
     * Updates an existing product category.
     *
     * @param id  Category ID to update
     * @param dto Updated category details
     * @return Updated ProductCategoryDTO
     * @throws ResourceNotFoundException if the category is not found
     * @throws IllegalArgumentException  if the new name conflicts with an existing category
     */
    public ProductCategoryDTO updateCategory(Long id, ProductCategoryDTO dto) {
        log.info("Updating product category with id: {}", id);

        ProductCategory existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", "id", id));

        String newName = dto.getName().trim();
        if (!existing.getName().equalsIgnoreCase(newName) && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw new IllegalArgumentException("Category with name '" + newName + "' already exists");
        }

        existing.setName(newName);
        existing.setDescription(dto.getDescription());
        if (dto.getIsActive() != null) {
            existing.setIsActive(dto.getIsActive());
        }

        ProductCategory updatedCategory = categoryRepository.save(existing);
        log.info("Updated product category successfully with id: {}", updatedCategory.getId());
        return convertToDTO(updatedCategory);
    }

    /**
     * Toggles the active status of a category (active <-> inactive).
     *
     * @param id Category ID
     * @return Updated ProductCategoryDTO
     * @throws ResourceNotFoundException if category is not found
     */
    public ProductCategoryDTO toggleCategory(Long id) {
        log.info("Toggling active status for product category with id: {}", id);

        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", "id", id));

        boolean newStatus = !Boolean.TRUE.equals(category.getIsActive());
        category.setIsActive(newStatus);

        ProductCategory saved = categoryRepository.save(category);
        log.info("Category id {} active status updated to: {}", id, newStatus);
        return convertToDTO(saved);
    }

    /**
     * Converts a ProductCategory entity to a ProductCategoryDTO.
     *
     * @param category Entity to convert
     * @return ProductCategoryDTO
     */
    public ProductCategoryDTO convertToDTO(ProductCategory category) {
        if (category == null) {
            return null;
        }
        return ProductCategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .build();
    }
}
