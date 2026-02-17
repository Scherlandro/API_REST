package com.biontecapi.dtos;


import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Collection;
import com.fasterxml.jackson.annotation.JsonFormat;


public record VendasDto(
        Integer idVenda,
        ClienteDTO cliente,
        Integer idFuncionario,
        String nomeFuncionario,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dtVenda,
       /* @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
        LocalDateTime dtVenda,
        OffsetDateTime dtVenda,
        */
        Double subtotal,
        Double desconto,
        Double totalgeral,
        String formasDePagamento,
        Integer qtdDeParcelas,
        Collection<ItensDaVendaDto> itensVdDTO
) {}
