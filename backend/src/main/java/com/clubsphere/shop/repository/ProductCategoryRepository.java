package com.clubsphere.shop.repository;

import com.clubsphere.shop.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductCategoryRepository — Spring Data JPA repository for ProductCategory entities.
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    /**
     * Finds all categories where isActive is true.
     *
     * @return List of active product categories
     */
    List<ProductCategory> findByIsActiveTrue();

    /**
     * Searches categories by name containing a given keyword (case-insensitive).
     *
     * @param name Keyword to match
     * @return List of matching categories
     */
    List<ProductCategory> findByNameContainingIgnoreCase(String name);

    /**
     * Finds a category by its exact name (case-insensitive).
     *
     * @param name Name to look for
     * @return Optional containing the category if found
     */
    Optional<ProductCategory> findByNameIgnoreCase(String name);

    /**
     * Checks if a category with the specified name already exists (case-insensitive).
     *
     * @param name Category name
     * @return true if category exists
     */
    boolean existsByNameIgnoreCase(String name);
}
