package com.biontecapi.dtos;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long userId;
    private Long productId;
    private Integer quantity;
}