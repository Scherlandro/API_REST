package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.CartItemDTO;
import com.biontecapi.model.CartItem;
import com.biontecapi.repository.CartItemRepository;
import com.biontecapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    public Optional<CartItem> getItemCartForUserIdEndProdId(Long userId, Long productId) {
        System.out.println("ID_USUARIO "+ userId + "ID_PRODUTO "  + productId);
        return repository.findByUserIdAndProductId(userId, productId);
    }

    @Override
    public List<CartItem> findForgottenItems(Integer days) {
        LocalDateTime daysAgo = LocalDateTime.now().minusDays(days);
      return repository.findForgottenItems(daysAgo);
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

    @Scheduled(cron = "0 0 0 * * ?")
    @Override
    public void clearForgottenItensCart() {
        LocalDateTime limite = LocalDateTime.now().minusDays(5);
        repository.deleteForgottenItems(limite);
    }

    @Override
    public void clearCart(Long id) {
        repository.deleteById(id);
    }
}
