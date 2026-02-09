package com.biontecapi.dtos;

import java.time.LocalDate;

public record ContasAReceberDto(
        Integer idContaReceber,
        Integer origemId,
        String tipoOrigem,
        Integer numeroParcela,
        Double valorParcela,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        String status
) {}