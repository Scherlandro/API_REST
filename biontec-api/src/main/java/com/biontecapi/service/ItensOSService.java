package com.biontecapi.service;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface ItensOSService {

    ItensDoServico saveOS(ItensDoServico ItensDoServico);

    List<ItensDoServico> findAll();

    Optional<ItensDoServico> findById(Integer id);

    List<ItensDoServicoDTO> listarItensOSPorIdProduto(Integer id);

    List<ItensDoServicoDTO> ConsultarItensOSEntreDatas(String dtIni, String dtFinal);

    List<ItensDoServicoDTO> litarItensOSPorData(String dt);


    List<ItensDoServicoDTO> litarItemOSPorCliente(String nome);


}
