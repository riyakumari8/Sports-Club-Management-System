package com.clubsphere.shop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ProductImage — Entity representing additional gallery images for a product.
 *
 * Maps directly to the PostgreSQL table 'product_images'.
 */
@Entity
@Table(name = "product_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    /**
     * Unique identifier for the product image.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Product to which this image belongs.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    /**
     * Read-only column mapping for the product_id foreign key.
     */
    @Column(name = "product_id", insertable = false, updatable = false)
    private Long productId;

    /**
     * URL or file path of the image.
     */
    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    /**
     * Flag indicating whether this is the primary thumbnail for the product.
     * Defaults to false.
     */
    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    /**
     * Timestamp when the image record was created.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Keeps productId in sync when product is assigned.
     */
    public void setProduct(Product product) {
        this.product = product;
        if (product != null) {
            this.productId = product.getId();
        }
    }

    public Long getProductId() {
        if (this.product != null) {
            return this.product.getId();
        }
        return this.productId;
    }

    /**
     * Auto-populate timestamp and defaults before persisting.
     */
    @PrePersist
    protected void onCreate() {
        if (this.isPrimary == null) {
            this.isPrimary = false;
        }
        if (this.product != null && this.productId == null) {
            this.productId = this.product.getId();
        }
        this.createdAt = LocalDateTime.now();
    }
}
