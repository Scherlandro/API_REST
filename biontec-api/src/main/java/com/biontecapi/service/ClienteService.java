package com.biontecapi.service;

import com.biontecapi.model.Cliente;
import com.biontecapi.repository.ClienteRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteService {

    List<Cliente> listarCliente();

    Cliente save(Cliente cliente);

    Optional<Cliente> litarClientePorCod(Integer id);

    List<Cliente> listarClientePorNome(String nome);

    Optional<Cliente> findById(Integer id);

    Boolean existsById(Integer id);

    void delete(Integer id);

}
