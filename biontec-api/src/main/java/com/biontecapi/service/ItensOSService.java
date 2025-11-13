package com.biontecapi.service;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface ItensOSService {

     ItensDoServico save(ItensDoServico ItensDoServico);

     List<ItensDoServico> findAll();

     Optional<ItensDoServico> findById(Integer id);

     List<ItensDoServicoDTO> listarItensDaVdPorId(Integer id);


     List<ItensDoServicoDTO> listarItensVdPorIdProduto(Integer id) ;
     List<ItensDoServicoDTO> ConsultarItensVdEntreDatas(String dtIni, String dtFinal);

   List<ItensDoServicoDTO> litarItemDaVendaPorData(String dt) ;


    List<ItensDoServicoDTO> litarItemDaVendaPorCliente(String nome)



}
