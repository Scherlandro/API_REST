package com.biontecapi.dtos;

public record FechamentoCaixaDto(
        String formaPagamento,
        Double totalRecebido,
        Long quantidadeTransacoes
) {}