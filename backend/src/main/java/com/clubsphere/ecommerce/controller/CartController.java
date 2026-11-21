package com.clubsphere.ecommerce.controller;

import com.clubsphere.common.dto.ApiResponse;
import com.clubsphere.ecommerce.dto.*;
import com.clubsphere.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@RequestParam Long customerId) {
        CartDTO cart = cartService.getCart(customerId);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(
            @RequestParam Long customerId,
            @Valid @RequestBody AddToCartDTO dto) {
        CartDTO cart = cartService.addToCart(customerId, dto);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemDTO dto) {
        CartDTO cart = cartService.updateCartItem(itemId, dto);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeCartItem(@PathVariable Long itemId) {
        cartService.removeCartItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@RequestParam Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }
}
