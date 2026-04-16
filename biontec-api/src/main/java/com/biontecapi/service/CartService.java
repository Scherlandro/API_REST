package com.biontecapi.service;

import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;

import java.util.List;

public interface CartService {

    List<CartItem> listByUser(Long userId) ;

     CartItem addToCart(CartItemDTO dto) ;

     void removeFromCart(Long userId, Long productId);

     void clearCart(Long id);

}
