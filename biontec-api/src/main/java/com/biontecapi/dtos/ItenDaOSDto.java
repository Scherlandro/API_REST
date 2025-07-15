package com.biontecapi.dtos;

import com.biontecapi.model.Produto;
import com.biontecapi.model.SubServicos;

import javax.persistence.ManyToOne;
import javax.persistence.Transient;

public record ItenDaOSDto(
        Long idItensDaOS,

        @ManyToOne
        @Transient
        Produto prod,

        SubServicos subservicos,

        String serviceType,
        Double precoDeVenda,
        Integer quantidade,
        Double total
) {
}
