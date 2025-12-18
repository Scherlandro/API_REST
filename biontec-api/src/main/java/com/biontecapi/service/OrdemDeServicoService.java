package com.biontecapi.service;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;

import java.util.List;
import java.util.Optional;

public interface OrdemDeServicoService {

    boolean existsById(Long id);

    Optional<OrdemDeServico> findById(Long id);

    List<OrdemDeServico> listarOS();

    Optional<OrdemDeServico> listarOSPorID(Long id);

    List<OrdemDeServico> listarOSPorStatus(String status);

    List<OrdemDeServico> listarOSPorIdCliente(Integer idCliente);

    List<OrdemDeServico> listarOSPorIdDoTecnico(Long idTecnico);

    OrdemDeServico criarOS(OrdemDeServicoDTO dto);

    OrdemDeServico atualizarOS(OrdemDeServico os);


    OrdemDeServico addItemNaOS(Long osID, ItensDoServicoDTO itemDto);

    OrdemDeServico removerItemDaOS(Long serviceOrderId, Long itemId);

    void removerOS(Long id);

    OrdemDeServico concluirOS(Long idOS);
}
