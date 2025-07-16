package com.biontecapi.serviceImpl;

import com.biontecapi.model.Cliente;
import com.biontecapi.repository.ClienteRepository;
import com.biontecapi.service.ClienteService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    final private ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> listarCliente() {
        Sort sort =  Sort.by(Sort.Direction.ASC,"nome_cliente")
                .and(Sort.by(Sort.Direction.ASC,"ultimaAtualizacao"));
        return clienteRepository.findAll(sort);
    }

    @Override
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Optional<Cliente> litarClientePorCod(Integer id) {
        return Optional.empty();
    }

    @Override
    public List<Cliente> listarClientePorNome(String nome) {
        return clienteRepository.listarClientePorNome(nome);
    }

    @Override
    public Optional<Cliente> findById(Integer id) {
        return clienteRepository.findById(id);
    }
    @Override
    public Boolean existsById(Integer id) {
        return clienteRepository.existsById(id);
    }

    @Override
    public void delete(Integer id) {
        clienteRepository.deleteById(id);
    }
}
