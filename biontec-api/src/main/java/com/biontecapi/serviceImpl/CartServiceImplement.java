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
public class CartServiceImplement implements CartService {

    private final CartItemRepository repository;

    public CartServiceImplement(CartItemRepository repository){
        this.repository = repository;
    }

    @Override
    public List<CartItem> listByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public Optional selectProd(Long userId, Long productId) {
        System.out.println("ID_USUARIO "+ userId + "ID_PRODUTO "  + productId);
        return repository.findByUserIdAndProductId(userId, productId);
    }

    @Override
    @Transactional
    public CartItem saveCartItem(CartItemDTO dto) {
        Optional<CartItem> existingItem = repository.findByUserIdAndProductId(dto.getUserId(), dto.getProductId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(dto.getQuantity());
            return repository.save(item);
        } else {
            // Se não existir, cria um novo
            CartItem newItem = CartItem.builder()
                    .userId(dto.getUserId())
                    .productId(dto.getProductId())
                    .quantity(dto.getQuantity())
                    .build();
            return repository.save(newItem);
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
