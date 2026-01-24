package com.biontecapi.dtos;


import java.time.LocalDateTime;
import java.util.Collection;
import com.fasterxml.jackson.annotation.JsonFormat;


public record VendasDto(
        Integer idVenda,
        Integer idCliente,
        String nomeCliente,
        Integer idFuncionario,
        String nomeFuncionario,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dtVenda,
        Double subtotal,
        Double desconto,
        Double totalgeral,
        String formasDePagamento,
        Integer qtdDeParcelas,
        Collection<ItensDaVendaDto> itensVd
) {}
