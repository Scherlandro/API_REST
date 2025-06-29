package com.biontecapi.service;

import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;

import java.util.List;
import java.util.Optional;

public interface OrdemDeServicoService {

        List<OrdemDeServico> listarOS();

        Optional<OrdemDeServico> listarOSPorID(Long id);

        List<OrdemDeServico> listarOSPorStatus(String status);

        OrdemDeServico createServiceOrder(OrdemDeServicoDTO dto) ;

        OrdemDeServico updateServiceOrder(Long id, OrdemDeServicoDTO dto) ;


}
