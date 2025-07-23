package com.biontecapi.dtos;

import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.ItenDaOSDto;
import com.biontecapi.model.Cliente;
import com.biontecapi.model.Funcionario;
import com.biontecapi.model.ItensDoServico;

import java.time.LocalDateTime;
import java.util.List;

public record OrdemDeServicoDTO(
        Long idOs,
        Integer clienteId,
        String nomeCliente,
        Integer funcionarioId,

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

        Funcionario gestorId,
        Funcionario tecnicoEncarregadoId,
        List<ItensDoServico> itensDoServicos
) {

}