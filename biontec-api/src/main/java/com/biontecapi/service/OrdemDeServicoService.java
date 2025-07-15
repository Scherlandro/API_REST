package com.biontecapi.service;

import com.biontecapi.dtos.ItenDaOSDto;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;

import java.util.List;
import java.util.Optional;

public interface OrdemDeServicoService {

    List<OrdemDeServico> listarOS();

    Optional<OrdemDeServico> listarOSPorID(Long id);

    List<OrdemDeServico> listarOSPorStatus(String status);

    List<OrdemDeServico> listarOSPorIdCliente(Integer idCliente);

    List<OrdemDeServico> listarOSPorIdDoTecnico(Long idTecnico);

    OrdemDeServico criarOS(OrdemDeServicoDTO dto);

    OrdemDeServico atualizarOS(Long id, OrdemDeServicoDTO dto);


    OrdemDeServico addItemNaOS(Long osID, ItenDaOSDto itemDto);

    OrdemDeServico removerItemDaOS(Long serviceOrderId, Long itemId);

    OrdemDeServico concluirOS(Long idOS);
}
