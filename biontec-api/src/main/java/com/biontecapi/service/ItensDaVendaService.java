package com.biontecapi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;


public interface ItensDaVendaService {

    List<ItensDaVenda> findAll();

    Optional<ItensDaVenda> findById(Integer id);

    List<ItensDaVenda> listarItensDaVdPorId(Integer id);

    List<ItensDaVenda> listarItensVdPorIdProduto(Integer id);

    List<ItensDaVenda> ConsultarItensVdEntreDatas(LocalDateTime dtIni, LocalDateTime dtFinal);

    List<ItensDaVenda> litarItemDaVendaPorData(String dt);

    List<ItensDaVenda> litarItemDaVendaPorCliente(String nome);

    ItensDaVenda save(ItensDaVendaDto dto);

    ItensDaVenda atualizarItensDaVenda(ItensDaVendaDto dto);

    void deletar(Integer id);
}
