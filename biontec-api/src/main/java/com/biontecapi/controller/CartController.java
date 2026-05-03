package com.biontecapi.controller;


import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;
import com.biontecapi.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/cartItens")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.listByUser(userId));
    }

    @GetMapping("/getItemCartForUser/{userId}/{productId}")
    public ResponseEntity<CartItem> getItemCartForUserIdEndProdId(
            @PathVariable("userId") Long userId,
            @PathVariable("productId") Long productId) {

        return cartService.getItemCartForUserIdEndProdId(userId, productId)
                .map(item -> ResponseEntity.ok((CartItem) item))
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/forgotten/{days}")
    public ResponseEntity findForgottenItems(@PathVariable("days") Integer days) {
        return ResponseEntity.ok(cartService.findForgottenItems(days));
    }

    @PostMapping("/salvar")
    public ResponseEntity<CartItem> addItem(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartService.saveCartItem(dto));
    }

    @PutMapping("/editar")
    public ResponseEntity<CartItem> editItem(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartService.saveCartItem(dto));
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable("userId") Long userId,
                                           @PathVariable("productId") Long productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Long id) {
        cartService.clearCart(id);
        return ResponseEntity.noContent().build();
    }

}
