package com.clubsphere.shop.repository;

import com.clubsphere.shop.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * ProductRepository — Spring Data JPA repository for Product entities.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Finds all active products.
     *
     * @return List of active products
     */
    List<Product> findByIsActiveTrue();

    /**
     * Finds active products belonging to a specific category.
     *
     * @param categoryId ID of the category
     * @return List of active products in that category
     */
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);

    /**
     * Finds all products belonging to a category (active and inactive).
     *
     * @param categoryId ID of the category
     * @return List of products in that category
     */
    List<Product> findByCategoryId(Long categoryId);

    /**
     * Searches active products by name containing a given keyword (case-insensitive).
     *
     * @param name Name keyword to match
     * @return List of matching active products
     */
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    /**
     * Dynamic search for products supporting keyword (matches name or description),
     * category filter, price range (minPrice, maxPrice), optional active-only filter, and dynamic sorting.
     *
     * @param keyword    Keyword to search in name or description (null to ignore)
     * @param categoryId Filter by category ID (null to ignore)
     * @param minPrice   Minimum selling price (null to ignore)
     * @param maxPrice   Maximum selling price (null to ignore)
     * @param activeOnly Filter for active products only (null to ignore)
     * @param sort       Spring Data Sort specification
     * @return Filtered and sorted list of products
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.sellingPrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) AND " +
           "(:activeOnly IS NULL OR p.isActive = :activeOnly)")
    List<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("activeOnly") Boolean activeOnly,
            Sort sort
    );

    /**
     * Dynamic search for active products with keyword, category filter, and price range.
     *
     * @param keyword    Keyword in name or description
     * @param categoryId Category ID filter
     * @param minPrice   Minimum selling price
     * @param maxPrice   Maximum selling price
     * @param sort       Sort criteria
     * @return Filtered list of products
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.sellingPrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.sellingPrice <= :maxPrice)")
    List<Product> searchAllProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Sort sort
    );
}
