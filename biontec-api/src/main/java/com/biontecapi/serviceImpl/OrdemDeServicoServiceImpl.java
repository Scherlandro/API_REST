package com.biontecapi.serviceImpl;


import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.repository.ClienteRepository;
import com.biontecapi.repository.FuncionarioRepository;
import com.biontecapi.repository.OrdemDeServicosRepository;
import com.biontecapi.service.OrdemDeServicoService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
    @Transactional
    public class OrdemDeServicoServiceImpl implements OrdemDeServicoService {

         final OrdemDeServicosRepository osRepository;
         final ClienteRepository clientRepository;
         final FuncionarioRepository funcionarioRepository;

    public OrdemDeServicoServiceImpl(OrdemDeServicosRepository osRepository,
                                     ClienteRepository clientRepository,
                                     FuncionarioRepository funcionarioRepository) {
        this.osRepository = osRepository;
        this.clientRepository = clientRepository;
        this.funcionarioRepository = funcionarioRepository;
    }


    @Override
    public List<OrdemDeServico> listarOS() {
        return osRepository.findAll();
    }

    @Override
    public Optional<OrdemDeServico> listarOSPorID(Long id) {
        return osRepository.findById(id);
    }

    @Override
    public List<OrdemDeServico> listarOSPorStatus(String status) {
        return osRepository.findByStatus(status);
    }


    @Override
    public OrdemDeServico createServiceOrder(OrdemDeServicoDTO dto) {
        OrdemDeServico order = new OrdemDeServico();

        order.setIdCliente(dto.idCliente());
        order.setNomeCliente(dto.nomeCliente());
        order.setIdFuncionario(dto.idFuncionario());
        order.setGestorDaOS(dto.gestorDaOS());
        order.setDataDeEntrada(LocalDateTime.now());
        order.setStatus(Status.OS_em_Andamento);
        return osRepository.save(order);
    }

    @Override
    public OrdemDeServico updateServiceOrder(Long id, OrdemDeServicoDTO dto) {
            OrdemDeServico order = osRepository.findById(id).orElseThrow();
            // update fields
            return osRepository.save(order);
        }


}
