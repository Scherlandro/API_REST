package com.biontecapi.controller;

import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;
import com.biontecapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/*
Lombok: Verifique se o plugin do Lombok está instalado na sua IDE para que o @Data funcione corretamente.

Transactional: Usei @Transactional no método de remoção customizado para garantir que o JPA gerencie a sessão corretamente ao deletar por campos que não são a chave primária.

Lógica do Mercado Livre: No mundo real, você provavelmente adicionaria uma verificação: se o produto já existe no carrinho para aquele usuário, você apenas daria um update na quantidade em vez de criar uma nova linha.
 */

@RestController
@RequestMapping("/api/cartItens")
@RequiredArgsConstructor
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.listByUser(userId));
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
    public ResponseEntity<Void> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        cartService.clearCart(id);
        return ResponseEntity.noContent().build();
    }
}