package com.clubsphere.repository;

import com.clubsphere.model.ShopProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProduct, Long> {
    List<ShopProduct> findByShopTypeOrderByCreatedAtDesc(String shopType);

    @Query("SELECT sp FROM ShopProduct sp WHERE " +
           "(CAST(:shopType AS String) IS NULL OR LOWER(sp.shopType) = LOWER(CAST(:shopType AS String))) AND " +
           "(CAST(:category AS String) IS NULL OR LOWER(sp.category) = LOWER(CAST(:category AS String))) AND " +
           "(CAST(:search AS String) IS NULL OR LOWER(sp.name) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')) OR LOWER(sp.description) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%'))) " +
           "ORDER BY sp.name ASC")
    List<ShopProduct> searchProducts(
            @Param("shopType") String shopType,
            @Param("category") String category,
            @Param("search") String search
    );
}
