package com.biontecapi.repository;

import com.biontecapi.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);

    void deleteByUserIdAndProductId(Long userId, Long productId);

    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.addedAt < :dataLimite")
    List<CartItem> findForgottenItems(@Param("dataLimite") LocalDateTime dataLimite);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.addedAt < :dataLimite")
    void deleteForgottenItems(@Param("dataLimite") LocalDateTime dataLimite);

}