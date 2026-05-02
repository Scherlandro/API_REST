package com.biontecapi.repository;

import com.biontecapi.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
   // Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    @Query(value = "Select ci from CartItem ci " +
            "where ci.userId = ?1 and ci.productId = ?2")
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
}