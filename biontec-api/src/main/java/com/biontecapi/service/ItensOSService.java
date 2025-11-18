package com.biontecapi.service;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;


import java.util.List;
import java.util.Optional;

public interface ItensOSService {

    boolean existsById(Long idItensDaOS);

    ItensDoServico saveItemOS(ItensDoServico ItensDoServico);

    ItensDoServico updateItemOS(ItensDoServico ItensDoServico);

    List<ItensDoServico> findAll();

    Optional<ItensDoServico> findById(Long id);

    List<ItensDoServicoDTO> listarItensOSPorIdProduto(Integer id);

    List<ItensDoServicoDTO> ConsultarItensOSEntreDatas(String dtIni, String dtFinal);

    List<ItensDoServicoDTO> litarItensOSPorData(String dt);


    List<ItensDoServicoDTO> litarItemOSPorCliente(String nome);


}
