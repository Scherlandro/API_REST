package com.biontecapi.service;

import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartService {

    List<CartItem> listByUser(Long userId) ;

    Optional<CartItem> getItemCartForUserIdEndProdId(Long userId, Long productId);

    List<CartItem> findForgottenItems(Integer days);

     CartItem saveCartItem(CartItemDTO dto) ;

    void clearForgottenItensCart();

     void removeFromCart(Long userId, Long productId);

     void clearCart(Long id);

}
