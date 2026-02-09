package com.biontecapi.dtos;

import java.time.LocalDate;

public record RelatorioInadimplenciaDto(
        Integer idConta,
        String nomeCliente,
        Double valorParcela,
        LocalDate vencimento,
        long diasAtraso,
        Integer idVenda
) {}