package com.biontecapi.dtos;

import com.biontecapi.Enum.Status;
import com.biontecapi.model.Funcionario;
import com.biontecapi.model.ItensDoServico;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public record OrdemDeServicoDTO(
        Long idOS,
        Integer clienteId,
        String nomeCliente,
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
        Collection<ItensDoServico> itensOS
) {

}