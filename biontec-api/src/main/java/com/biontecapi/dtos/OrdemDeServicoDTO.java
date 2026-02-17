package com.biontecapi.dtos;

import com.biontecapi.enuns.Status;
import com.biontecapi.model.Funcionario;

import java.time.LocalDateTime;
import java.util.Collection;

public record OrdemDeServicoDTO(
        Long idOS,
        ClienteDTO cliente,
        Integer idFuncionario,
        String nomeFuncionario,

        LocalDateTime dataDeEntrada,
        LocalDateTime ultimaAtualizacao,

        Status status,
        Double subtotal,
        Double desconto,
        Double porConta,
        Double totalGeralOS,
        Double restante,

        Funcionario gestorDaOS,
        Funcionario tecnicoEncarregado,
        Collection<ItensDoServicoDTO> itensDoServicoDTO
) {

}