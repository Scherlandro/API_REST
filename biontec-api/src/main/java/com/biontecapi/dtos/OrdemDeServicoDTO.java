package com.biontecapi.dtos;

import com.biontecapi.Enum.Status;
import com.biontecapi.model.Cliente;
import com.biontecapi.model.Funcionario;
import com.biontecapi.model.SubServicos;

import java.time.LocalDateTime;
import java.util.List;

public record OrdemDeServicoDTO(
        Long id,

        int idCliente,
        String nomeCliente,
        Integer idFuncionario,
        String gestorDaOS,
        String tecnicoDaOs,

        LocalDateTime dataDeEntrada,
        LocalDateTime ultimaAtualizacao,
        Status status,

        Double subtotal,
        Double desconto,
        Double porConta,
        Double total,
        Double restante,
        List<SubServicos> subservicos
) {
}
