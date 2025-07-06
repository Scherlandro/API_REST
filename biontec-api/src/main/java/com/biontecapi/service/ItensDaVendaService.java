package com.biontecapi.service;

import java.util.List;
import java.util.Optional;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;


public interface ItensDaVendaService {

    List<ItensDaVenda> findAll();

    Optional<ItensDaVenda> findById(Integer id);

    List<ItensDaVendaDto> listarItensDaVdPorId(Integer id);

    List<ItensDaVendaDto> ConsultarItensVdEntreDatas(String dtIni, String dtFinal);

    List<ItensDaVendaDto> litarItemDaVendaPorData(String dt);

    List<ItensDaVendaDto> litarItemDaVendaPorCliente(String nome);

    ItensDaVenda save(ItensDaVenda itensDaVenda);

}
