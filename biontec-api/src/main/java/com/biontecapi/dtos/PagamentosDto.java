package com.biontecapi.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record PagamentosDto(
        Integer idPagamento,
        Double valorPago,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dtPagamento,
        String formaPagamento,
        Integer status,
        Integer origemId,
        String tipoOrigem
) {}

