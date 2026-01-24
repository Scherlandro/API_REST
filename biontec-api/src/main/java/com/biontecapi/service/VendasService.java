package com.biontecapi.service;

import com.biontecapi.dtos.VendasDto;
import com.biontecapi.model.Vendas;

import java.util.List;
import java.util.Optional;

public interface VendasService {

    List<Vendas> listarVendas();
    Vendas save(Vendas vendas) ;
    Vendas atualizarVenda(VendasDto dto);
    Optional<Vendas> litarVendaPorCod(Integer id) ;
    List<Vendas> litarVendaPorCliente(String name) ;
    VendasDto findById(Integer id) ;
    void delete(Integer id);

}