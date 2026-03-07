package com.biontecapi.dtos;


import java.time.OffsetDateTime;

public record PagamentosDto(
        Integer idPagamento,
        Double valorPago,
        OffsetDateTime dtPagamento,
        String formaPagamento,
        Integer status,
        Integer origemId,
        String tipoOrigem
) {}

