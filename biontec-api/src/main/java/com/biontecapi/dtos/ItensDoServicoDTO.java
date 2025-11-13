package com.biontecapi.dtos;

import com.biontecapi.model.Produto;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

public record ItensDoServicoDTO(
        Long idItensDaOS,
        String codOS,

        @ManyToOne
        @Transient
        Produto prod,
        String codProduto,
        String descricao,
        Double valorUnitario,
        Integer quantidade,
        Double total


) {
}
