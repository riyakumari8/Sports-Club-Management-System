package com.clubsphere.cafe.repository;

import com.clubsphere.cafe.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MenuCategoryRepository — Data access operations for menu categories.
 */
@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {

    /**
     * Retrieves all active menu categories.
     *
     * @return List of active MenuCategory entities
     */
    List<MenuCategory> findByIsActiveTrue();
}
