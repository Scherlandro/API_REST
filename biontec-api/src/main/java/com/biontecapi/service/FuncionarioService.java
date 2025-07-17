package com.biontecapi.service;

import com.biontecapi.model.Funcionario;

import java.util.List;
import java.util.Optional;

public interface FuncionarioService {
    

       List<Funcionario> listarFuncionario();

    Funcionario save(Funcionario funcionario);

    Optional<Funcionario> litarFuncionarioPorCod(Integer id);

    List<Funcionario> listarFuncionarioPorNome(String nome);

    Optional<Funcionario> findById(Integer id);

    Boolean existsById(Integer id);

    void delete(Integer id);

}
