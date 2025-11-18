package com.biontecapi.dtos;


public record ItensDoServicoDTO(
        Long idItensDaOS,
        Long codOS,
        String codProduto,
        String descricao,
        Double valorUnitario,
        Integer quantidade,
        Double total

) {
}
