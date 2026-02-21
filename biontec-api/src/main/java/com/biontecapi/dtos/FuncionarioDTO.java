package com.biontecapi.dtos;

import com.biontecapi.model.Endereco;


public record FuncionarioDTO(
        Integer id_funcionario,
        String nomeFuncionario,
        String rg,
        String cpf,
        String dtNascimnento,
        String dtAdmissao,
        String dtDemissao,
        String cargo,
        Double salario,
        String tipo_logradouro,
        String logradouro,
        Integer n_residencial,
        String complemento,
        String bairro,
        String cidade,
        String telefone,
        String celular,
        String zap,
        String email,
        String obs
        ){
        }
