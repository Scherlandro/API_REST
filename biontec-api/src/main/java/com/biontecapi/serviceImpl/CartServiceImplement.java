package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;
import com.biontecapi.repository.CartItemRepository;
import com.biontecapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

    @Service
    @RequiredArgsConstructor
    public class CartServiceImplement implements CartService {

        private final CartItemRepository repository;

        @Override
        public List<CartItem> listByUser(Long userId) {
            return repository.findByUserId(userId);
        }

        @Override
        public CartItem saveCartItem(CartItemDTO dto) {
            System.out.println("INTEM PARA O CARRINHO--> " + dto);

            CartItem item = CartItem.builder()
                    .userId(dto.getUserId())
                    .productId(dto.getProductId())
                    .quantity(dto.getQuantity())
                    .build();
            return repository.save(item);
        }

        @Transactional
        @Override
        public void removeFromCart(Long userId, Long productId) {
            repository.deleteByUserIdAndProductId(userId, productId);
        }

        @Override
        public void clearCart(Long id) {
            repository.deleteById(id);
        }
    }
