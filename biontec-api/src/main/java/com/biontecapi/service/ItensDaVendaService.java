package com.biontecapi.service;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.repository.ItensDaVendaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


public interface ItensDaVendaService {

    List<ItensDaVenda> findAll();

    Optional<ItensDaVenda> findById(Integer id);

    List<ItensDaVendaDto> listarItensDaVdPorId(Integer id);

    List<ItensDaVendaDto> ConsultarItensVdEntreDatas(String dtIni, String dtFinal);

    List<ItensDaVendaDto> litarItemDaVendaPorData(String dt);

    List<ItensDaVendaDto> litarItemDaVendaPorCliente(String nome);

    ItensDaVenda save(ItensDaVenda itensDaVenda);

}
