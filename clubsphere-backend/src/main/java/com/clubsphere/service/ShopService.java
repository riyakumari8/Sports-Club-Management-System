package com.clubsphere.service;

import com.clubsphere.model.ShopProduct;
import com.clubsphere.repository.ShopProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopProductRepository shopProductRepository;

    public List<ShopProduct> getProducts(String shopType, String category, String search) {
        if (shopType == null && category == null && search == null) {
            return shopProductRepository.findAll();
        }
        return shopProductRepository.searchProducts(shopType, category, search);
    }

    public List<ShopProduct> getProductsByShopType(String shopType) {
        return shopProductRepository.findByShopTypeOrderByCreatedAtDesc(shopType);
    }

    public ShopProduct getProductById(Long id) {
        return shopProductRepository.findById(id).orElse(null);
    }
}
