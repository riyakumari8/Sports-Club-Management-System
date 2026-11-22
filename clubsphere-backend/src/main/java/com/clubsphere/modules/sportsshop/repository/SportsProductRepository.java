package com.clubsphere.modules.sportsshop.repository;

import com.clubsphere.modules.sportsshop.entity.SportsProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportsProductRepository extends JpaRepository<SportsProduct, Long> {
    Optional<SportsProduct> findBySku(String sku);
    Optional<SportsProduct> findByBarcode(String barcode);

    List<SportsProduct> findByIsActiveTrue();

    @Query("SELECT p FROM SportsProduct p WHERE p.isActive = true AND p.stockQuantity <= p.reorderLevel")
    List<SportsProduct> findLowStockProducts();

    @Query("SELECT p FROM SportsProduct p WHERE p.isActive = true AND p.stockQuantity = 0")
    List<SportsProduct> findOutOfStockProducts();

    @Query("SELECT p FROM SportsProduct p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<SportsProduct> searchProducts(@Param("categoryId") Integer categoryId, @Param("search") String search);

    long countByIsActiveTrue();
    long countByIsActiveTrueAndStockQuantityGreaterThan(int qty);
    long countByIsActiveTrueAndStockQuantityLessThanEqual(int qty);
    long countByIsActiveTrueAndStockQuantityEquals(int qty);
}
