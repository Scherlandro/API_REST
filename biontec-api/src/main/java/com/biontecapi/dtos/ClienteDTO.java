package com.biontecapi.dtos;


public record ClienteDTO(
        Integer id_cliente,
        String nome_cliente,
        String inscricaoest,
        String pessoa,
        String cpf,
        String cnpj,
        Integer numero,
        String cep,
        String telefone,
        String celular,
        String zap
        ) { }
