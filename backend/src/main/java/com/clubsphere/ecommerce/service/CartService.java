package com.clubsphere.ecommerce.service;

import com.clubsphere.common.exception.ResourceNotFoundException;
import com.clubsphere.ecommerce.dto.*;
import com.clubsphere.ecommerce.entity.Cart;
import com.clubsphere.ecommerce.entity.CartItem;
import com.clubsphere.ecommerce.repository.CartItemRepository;
import com.clubsphere.ecommerce.repository.CartRepository;
import com.clubsphere.inventory.entity.Inventory;
import com.clubsphere.inventory.repository.InventoryRepository;
import com.clubsphere.shop.entity.Product;
import com.clubsphere.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public CartDTO getCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElse(null);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return CartDTO.builder()
                    .customerId(customerId)
                    .items(new ArrayList<>())
                    .totalAmount(BigDecimal.ZERO)
                    .build();
        }
        return mapToCartDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(Long customerId, AddToCartDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + dto.getProductId()));

        if (!product.getIsActive()) {
            throw new IllegalArgumentException("Product is not available");
        }

        int available = inventoryRepository.findByProductId(dto.getProductId())
                .map(Inventory::getQuantityInStock).orElse(0);
        if (available < dto.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + available);
        }

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().customerId(customerId).build();
                    return cartRepository.save(newCart);
                });

        // Check if product already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(dto.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + dto.getQuantity();
            if (newQty > available) {
                throw new IllegalArgumentException("Total quantity exceeds available stock. Available: " + available);
            }
            item.setQuantity(newQty);
            item.setUnitPrice(product.getSellingPrice());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(dto.getProductId())
                    .quantity(dto.getQuantity())
                    .unitPrice(product.getSellingPrice())
                    .addedAt(LocalDateTime.now())
                    .build();
            cart.addItem(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        log.info("Added product {} to cart for customer {}", dto.getProductId(), customerId);
        return mapToCartDTO(savedCart);
    }

    @Transactional
    public CartDTO updateCartItem(Long itemId, UpdateCartItemDTO dto) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + itemId));

        int available = inventoryRepository.findByProductId(item.getProductId())
                .map(Inventory::getQuantityInStock).orElse(0);
        if (dto.getQuantity() > available) {
            throw new IllegalArgumentException("Quantity exceeds available stock. Available: " + available);
        }

        item.setQuantity(dto.getQuantity());
        cartItemRepository.save(item);

        Cart cart = item.getCart();
        return mapToCartDTO(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public void removeCartItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + itemId));
        cartItemRepository.delete(item);
        log.info("Removed cart item {}", itemId);
    }

    @Transactional
    public void clearCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
            log.info("Cleared cart for customer {}", customerId);
        }
    }

    private CartDTO mapToCartDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            int stockAvailable = inventoryRepository.findByProductId(item.getProductId())
                    .map(Inventory::getQuantityInStock).orElse(0);

            return CartItemDTO.builder()
                    .id(item.getId())
                    .productId(item.getProductId())
                    .productName(product != null ? product.getName() : "Unknown")
                    .productImage(product != null ? product.getImageUrl() : null)
                    .quantity(item.getQuantity())
                    .unitPrice(product != null ? product.getSellingPrice() : item.getUnitPrice())
                    .lineTotal(product != null
                            ? product.getSellingPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                            : item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .stockAvailable(stockAvailable)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal totalAmount = itemDTOs.stream()
                .map(CartItemDTO::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .customerId(cart.getCustomerId())
                .items(itemDTOs)
                .totalAmount(totalAmount)
                .build();
    }
}
