package com.clubsphere.shop.repository;

import com.clubsphere.shop.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductImageRepository — Spring Data JPA repository for ProductImage entities.
 */
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    /**
     * Finds all images associated with a specific product.
     *
     * @param productId ID of the product
     * @return List of images for that product
     */
    List<ProductImage> findByProductId(Long productId);

    /**
     * Finds the primary image for a specific product.
     *
     * @param productId ID of the product
     * @return Optional containing the primary image if found
     */
    Optional<ProductImage> findByProductIdAndIsPrimaryTrue(Long productId);

    /**
     * Deletes all images belonging to a specific product.
     *
     * @param productId ID of the product
     */
    void deleteByProductId(Long productId);
}
