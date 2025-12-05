package com.biontecapi.serviceImpl;


import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.ItensDoServico;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.repository.*;
import com.biontecapi.service.OrdemDeServicoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
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
    final ItensDaOSRepository itensDaOSRepository;
    final ProdutoRepository productRepository;


    public OrdemDeServicoServiceImpl(OrdemDeServicosRepository osRepository,
                                     ClienteRepository clientRepository,
                                     FuncionarioRepository funcionarioRepository,
                                     ItensDaOSRepository itensDaOSRepository,
                                     ProdutoRepository productRepository) {
        this.osRepository = osRepository;
        this.clientRepository = clientRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.itensDaOSRepository = itensDaOSRepository;
        this.productRepository = productRepository;
    }

    @Override
    public boolean existsById(Long id) {
        return osRepository.existsById(id);
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
    public List<OrdemDeServico> listarOSPorIdCliente(Integer idCliente) {
        return null;
    }

    @Override
    public List<OrdemDeServico> listarOSPorIdDoTecnico(Long idTecnico) {
        return null;
    }


    @Override
    public OrdemDeServico criarOS(OrdemDeServicoDTO dto) {
        OrdemDeServico order = new OrdemDeServico();
        order.setIdCliente(dto.clienteId());
        order.setNomeCliente(dto.nomeCliente());
        order.setIdFuncionario(dto.idFuncionario());
        order.setGestorDaOS(dto.gestorDaOS());
        order.setDataDeEntrada(LocalDateTime.now());
        order.setStatus(Status.OS_em_Andamento);
        return osRepository.save(order);
        /*
         order.setUserId(dto.userId());
        order.setTechnicianId(dto.technicianId());
        order.setDeviceDescription(dto.deviceDescription());
        order.setIssueDescription(dto.issueDescription());
         */
    }

/*    @Override
    public OrdemDeServico atualizarOS(Long id, OrdemDeServicoDTO dto) {
        OrdemDeServico order = osRepository.findById(id).orElseThrow();
            *//*
              if (dto.technicianId() != null) {
            order.setTechnicianId(dto.technicianId());
        }
        if (dto.deviceDescription() != null) {
            order.setDeviceDescription(dto.deviceDescription());
        }
        if (dto.issueDescription() != null) {
            order.setIssueDescription(dto.issueDescription());
        }
        if (dto.status() != null) {
            order.setStatus(dto.status());
        }
             *//*
        return osRepository.save(order);
    }*/

    @Override
    public OrdemDeServico atualizarOS( OrdemDeServico os) {
        return osRepository.save(os);
    }


    @Override
    public OrdemDeServico addItemNaOS(Long osID, ItensDoServicoDTO itemDto) {
        OrdemDeServico order = osRepository.findById(osID).orElseThrow();


       /* if (itemDto.idItensDaOS() != null) {
            productRepository.findById(itemDto.prod().getIdProduto()).orElseThrow();
        } else if (itemDto.idItensDaOS() != null) {
            osRepository.findById(osID).orElseThrow();
        }
*/
      /*  ItensDoServico newItem = new ItensDoServico();
        newItem.setCodOS(String.valueOf(order.getId_os()));
        newItem.setCodProduto(itemDto.codProduto());
        newItem.setIdItensDaOS(itemDto.idItensDaOS());
        newItem.setQuantidade(itemDto.quantidade());
        newItem.setValorUnitario(itemDto.valorUnitario());

        //order.getSubservicos().add(newItem);
        itensDaOSRepository.save(newItem);*/

        // Recalcular total da OS
        calcularTotalDaOS(order);
        return osRepository.save(order);
    }

    @Override
    public OrdemDeServico removerItemDaOS(Long serviceOrderId, Long itemId) {

        OrdemDeServico order = osRepository.findById(serviceOrderId).orElseThrow();

        // order.getItems().removeIf(item -> item.getId().equals(itemId));
        itensDaOSRepository.deleteById(itemId);

        calcularTotalDaOS(order);
        return osRepository.save(order);
    }


    @Override
    public OrdemDeServico concluirOS(Long idOS) {
        OrdemDeServico serviceOrder = osRepository.findById(idOS).orElseThrow();
        serviceOrder.setStatus(serviceOrder.getStatus());
        // serviceOrder.setCompletionDate(LocalDateTime.now());
        return osRepository.save(serviceOrder);
    }

    private void calcularTotalDaOS(OrdemDeServico order) {
      /*  double total = order.getItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
        order.setTotalAmount(total);*/
    }

}
