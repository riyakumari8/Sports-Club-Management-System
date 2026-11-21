package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MenuItemRepository — Data access operations for cafe & bar menu items.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Finds all menu items currently marked as available.
     *
     * @return List of available MenuItems
     */
    List<MenuItem> findByIsAvailableTrue();

    /**
     * Finds available items belonging to a specific category.
     *
     * @param categoryId Category ID
     * @return List of available MenuItems in that category
     */
    List<MenuItem> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    /**
     * Finds all items belonging to a specific category (including unavailable).
     *
     * @param categoryId Category ID
     * @return List of MenuItems in that category
     */
    List<MenuItem> findByCategoryId(Long categoryId);

    /**
     * Searches menu items whose name contains the search keyword (case-insensitive).
     *
     * @param name Search query substring
     * @return Matching MenuItems
     */
    List<MenuItem> findByNameContainingIgnoreCase(String name);
}
