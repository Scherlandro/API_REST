package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;
import com.biontecapi.repository.CartItemRepository;
import com.biontecapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
    @RequiredArgsConstructor
    public class CartServiceImplement implements CartService {

        private final CartItemRepository repository;

        @Override
        public List<CartItem> listByUser(Long userId) {
            return repository.findByUserId(userId);
        }

    /*    @Override
        public CartItem saveCartItem(CartItemDTO dto) {
            System.out.println("INTEM PARA O CARRINHO--> " + dto);

            CartItem item = CartItem.builder()
                    .userId(dto.getUserId())
                    .productId(dto.getProductId())
                    .quantity(dto.getQuantity())
                    .build();
            return repository.save(item);
        }*/


        @Override
        @Transactional
        public CartItem saveCartItem(CartItemDTO dto) {
            // Tenta encontrar um item existente para o mesmo usuário e produto
            Optional<CartItem> existingItem = repository.findByUserIdAndProductId(dto.getUserId(), dto.getProductId());

            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(dto.getQuantity()); // Atualiza a quantidade
                return repository.save(item);         // Faz o UPDATE
            } else {
                // Se não existir, cria um novo
                CartItem newItem = CartItem.builder()
                        .userId(dto.getUserId())
                        .productId(dto.getProductId())
                        .quantity(dto.getQuantity())
                        .build();
                return repository.save(newItem);      // Faz o INSERT
            }
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
