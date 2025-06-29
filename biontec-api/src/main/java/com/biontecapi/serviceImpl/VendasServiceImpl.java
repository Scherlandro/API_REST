package com.biontecapi.serviceImpl;


import com.biontecapi.model.Vendas;
import com.biontecapi.repository.VendasRepository;
import com.biontecapi.service.VendasService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendasServiceImpl implements VendasService {
    final VendasRepository vendasRepository;

    public VendasServiceImpl(VendasRepository repository) {

        this.vendasRepository = repository;
    }

    @Override
    public List<Vendas> listarVendas() {
        return vendasRepository.findAll();
    }


    @Override
    public Optional<Vendas> litarVendaPorCod(Integer id) {
        return vendasRepository.findById(id);
    }

    @Override
    public List<Vendas> litarVendaPorCliente(String nome_cliente) {
        return vendasRepository.findVendasByNomeDoCliente(nome_cliente);
    }

    @Override
    public Optional<Vendas> findById(Integer id) {
        return vendasRepository.findById(id);
    }

    @Override
    public Vendas save(Vendas vendas) {
        return vendasRepository.save(vendas);
    }

    @Override
    public void delete(Integer id) {
        vendasRepository.deleteById(id);
    }


}
