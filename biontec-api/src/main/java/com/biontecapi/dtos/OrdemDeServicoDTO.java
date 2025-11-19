package com.biontecapi.dtos;

import com.biontecapi.Enum.Status;
import com.biontecapi.model.Funcionario;
import com.biontecapi.model.ItensDoServico;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public record OrdemDeServicoDTO(
        Long idOs,
        Integer clienteId,
        String nomeCliente,
        Integer idFuncionario,

        LocalDateTime dataDeEntrada,
        LocalDateTime ultimaAtualizacao,

        Status status,
        Double subtotal,
        Double desconto,
        Double porConta,
        Double total,
        Double restante,

        String descricaoObj,
        String numeracao,
        String cor,
        String observacao,

        Funcionario gestorDaOS,
        Funcionario tecnicoEncarregado,
        Collection<ItensDoServico> itensOS
) {

}