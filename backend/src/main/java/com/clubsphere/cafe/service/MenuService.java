package com.clubsphere.cafe.service;

import com.clubsphere.cafe.dto.MenuCategoryDTO;
import com.clubsphere.cafe.dto.MenuItemCreateDTO;
import com.clubsphere.cafe.dto.MenuItemDTO;
import com.clubsphere.cafe.entity.MenuCategory;
import com.clubsphere.cafe.entity.MenuItem;
import com.clubsphere.cafe.repository.MenuCategoryRepository;
import com.clubsphere.cafe.repository.MenuItemRepository;
import com.clubsphere.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * MenuService — Manages cafe categories, menu items, pricing, and discount calculations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    // =========================================================================
    // CATEGORY OPERATIONS
    // =========================================================================

    /**
     * Retrieves all menu categories.
     *
     * @return List of all categories
     */
    @Transactional(readOnly = true)
    public List<MenuCategoryDTO> getAllCategories() {
        log.debug("Fetching all menu categories");
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves only active menu categories.
     *
     * @return List of active categories
     */
    @Transactional(readOnly = true)
    public List<MenuCategoryDTO> getActiveCategories() {
        log.debug("Fetching active menu categories");
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single menu category by its ID.
     *
     * @param id Category ID
     * @return MenuCategoryDTO
     */
    @Transactional(readOnly = true)
    public MenuCategoryDTO getCategoryById(Long id) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuCategory", "id", id));
        return mapCategoryToDTO(category);
    }

    /**
     * Creates a new menu category.
     *
     * @param dto Category creation payload
     * @return Created MenuCategoryDTO
     */
    public MenuCategoryDTO createCategory(MenuCategoryDTO dto) {
        log.info("Creating new menu category: {}", dto.getName());
        MenuCategory category = MenuCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        MenuCategory saved = categoryRepository.save(category);
        return mapCategoryToDTO(saved);
    }

    /**
     * Updates an existing menu category.
     *
     * @param id  Category ID
     * @param dto Updated category details
     * @return Updated MenuCategoryDTO
     */
    public MenuCategoryDTO updateCategory(Long id, MenuCategoryDTO dto) {
        log.info("Updating menu category with ID: {}", id);
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuCategory", "id", id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getIsActive() != null) {
            category.setIsActive(dto.getIsActive());
        }

        MenuCategory updated = categoryRepository.save(category);
        return mapCategoryToDTO(updated);
    }

    /**
     * Deactivates a category by setting isActive to false.
     *
     * @param id Category ID
     */
    public void deactivateCategory(Long id) {
        log.info("Deactivating category ID: {}", id);
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuCategory", "id", id));
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    // =========================================================================
    // MENU ITEM OPERATIONS
    // =========================================================================

    /**
     * Retrieves all menu items, optionally filtered by category.
     *
     * @param categoryId Optional category ID filter
     * @return List of MenuItemDTOs
     */
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getAllMenuItems(Long categoryId) {
        log.debug("Fetching menu items with categoryId filter: {}", categoryId);
        List<MenuItem> items;
        if (categoryId != null) {
            items = menuItemRepository.findByCategoryId(categoryId);
        } else {
            items = menuItemRepository.findAll();
        }

        return items.stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single menu item by ID.
     *
     * @param id Menu item ID
     * @return MenuItemDTO
     */
    @Transactional(readOnly = true)
    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        return mapItemToDTO(item);
    }

    /**
     * Retrieves menu items for a specific category.
     *
     * @param categoryId Category ID
     * @return List of MenuItemDTOs
     */
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuByCategory(Long categoryId) {
        log.debug("Fetching menu items for category: {}", categoryId);
        return menuItemRepository.findByCategoryId(categoryId).stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Searches menu items by keyword in name.
     *
     * @param query Search keyword
     * @return List of matching MenuItemDTOs
     */
    @Transactional(readOnly = true)
    public List<MenuItemDTO> searchMenu(String query) {
        log.debug("Searching menu items for query: {}", query);
        if (query == null || query.isBlank()) {
            return getAllMenuItems(null);
        }
        return menuItemRepository.findByNameContainingIgnoreCase(query.trim()).stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new menu item.
     *
     * @param dto MenuItem creation details
     * @return Created MenuItemDTO
     */
    public MenuItemDTO createMenuItem(MenuItemCreateDTO dto) {
        log.info("Creating new menu item: {}", dto.getName());
        MenuCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("MenuCategory", "id", dto.getCategoryId()));

        MenuItem item = MenuItem.builder()
                .category(category)
                .categoryId(category.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .price(dto.getPrice())
                .discountPercent(dto.getDiscountPercent() != null ? dto.getDiscountPercent() : BigDecimal.ZERO)
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .build();

        MenuItem saved = menuItemRepository.save(item);
        return mapItemToDTO(saved);
    }

    /**
     * Updates an existing menu item.
     *
     * @param id  Menu item ID
     * @param dto Updated details
     * @return Updated MenuItemDTO
     */
    public MenuItemDTO updateMenuItem(Long id, MenuItemCreateDTO dto) {
        log.info("Updating menu item ID: {}", id);
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        if (!item.getCategory().getId().equals(dto.getCategoryId())) {
            MenuCategory newCategory = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuCategory", "id", dto.getCategoryId()));
            item.setCategory(newCategory);
            item.setCategoryId(newCategory.getId());
        }

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setImageUrl(dto.getImageUrl());
        item.setPrice(dto.getPrice());
        if (dto.getDiscountPercent() != null) {
            item.setDiscountPercent(dto.getDiscountPercent());
        }
        if (dto.getIsAvailable() != null) {
            item.setIsAvailable(dto.getIsAvailable());
        }

        MenuItem updated = menuItemRepository.save(item);
        return mapItemToDTO(updated);
    }

    /**
     * Deactivates a menu item (sets isAvailable = false).
     *
     * @param id Menu item ID
     * @return Updated MenuItemDTO
     */
    public MenuItemDTO deactivateMenuItem(Long id) {
        log.info("Deactivating menu item ID: {}", id);
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        item.setIsAvailable(false);
        MenuItem saved = menuItemRepository.save(item);
        return mapItemToDTO(saved);
    }

    // =========================================================================
    // PRICE CALCULATION & MAPPERS
    // =========================================================================

    /**
     * Calculates the effective selling price after applying any discount percentage.
     * effectivePrice = price * (1 - discountPercent / 100)
     *
     * @param price           Original item price
     * @param discountPercent Discount percentage (0-100)
     * @return Rounded 2-decimal effective price
     */
    public BigDecimal calculateEffectivePrice(BigDecimal price, BigDecimal discountPercent) {
        if (price == null) {
            return BigDecimal.ZERO;
        }
        if (discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) <= 0) {
            return price.setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal discountFactor = BigDecimal.ONE.subtract(
                discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
        );
        return price.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
    }

    public MenuCategoryDTO mapCategoryToDTO(MenuCategory category) {
        if (category == null) return null;
        return MenuCategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .build();
    }

    public MenuItemDTO mapItemToDTO(MenuItem item) {
        if (item == null) return null;
        BigDecimal effective = calculateEffectivePrice(item.getPrice(), item.getDiscountPercent());
        String categoryName = item.getCategory() != null ? item.getCategory().getName() : null;
        Long catId = item.getCategory() != null ? item.getCategory().getId() : item.getCategoryId();

        return MenuItemDTO.builder()
                .id(item.getId())
                .categoryId(catId)
                .categoryName(categoryName)
                .name(item.getName())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .price(item.getPrice())
                .discountPercent(item.getDiscountPercent())
                .effectivePrice(effective)
                .isAvailable(item.getIsAvailable())
                .build();
    }
}
