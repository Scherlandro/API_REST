package com.biontecapi.serviceImpl;


import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.repository.*;
import com.biontecapi.service.OrdemDeServicoService;
import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;


@Service
@Transactional
public class OrdemDeServicoServiceImpl implements OrdemDeServicoService {

    final OrdemDeServicosRepository osRepository;
    final ClienteRepository clientRepository;
    final FuncionarioRepository funcionarioRepository;
    final ItensDaOSRepository itensDaOSRepository;
    final ProdutoRepository productRepository;

   private static Logger LOGGER = LoggerFactory.getLogger(OrdemDeServicoServiceImpl.class);

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
    public Optional<OrdemDeServico> findById(Long id) {
        return osRepository.findById(id);
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
        order.setNomeFuncionario(dto.nomeFuncionario());
       // order.setGestorDaOS(dto.gestorDaOS());
        order.setDataDeEntrada(LocalDateTime.now());
        order.setStatus(Status.OS_em_Andamento);
        return osRepository.save(order);
    }

    @Override
    public OrdemDeServico atualizarOS(OrdemDeServicoDTO dto) {

        OrdemDeServico order = osRepository.findById(dto.idOS()).orElseThrow();

        order.setIdCliente(dto.clienteId());
        order.setNomeCliente(dto.nomeCliente());
        order.setIdFuncionario(dto.idFuncionario());
        order.setNomeFuncionario(dto.nomeFuncionario());
        order.setDataDeEntrada(LocalDateTime.now());
        order.setStatus(Status.OS_em_Andamento);
        order.setDesconto(dto.desconto());
        order.setSubtotal(dto.subtotal());

        order.setTotalGeralOS(calcularTotalDaOS(order));

        return osRepository.save(order);
    }


    @Override
    public OrdemDeServico addItemNaOS(Long osID, ItensDoServicoDTO itemDto) {
        OrdemDeServico order = osRepository.findById(osID).orElseThrow();

       /* if (itemDto.idItensDaOS() != null) {
            productRepository.findById(itemDto.prod().getIdProduto()).orElseThrow();
        } else if (itemDto.idItensDaOS() != null) {
            osRepository.findById(osID).orElseThrow();
        }
         ItensDoServico newItem = new ItensDoServico();
        newItem.setCodOS(String.valueOf(order.getId_os()));
        newItem.setCodProduto(itemDto.codProduto());
        newItem.setIdItensDaOS(itemDto.idItensDaOS());
        newItem.setQuantidade(itemDto.quantidade());
        newItem.setValorUnitario(itemDto.valorUnitario());

        order.getSubservicos().add(newItem);
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
    public void removerOS(Long id) {
        osRepository.deleteById(id);
    }


    @Override
    public OrdemDeServico concluirOS(Long idOS) {
        OrdemDeServico serviceOrder = osRepository.findById(idOS).orElseThrow();
        serviceOrder.setStatus(serviceOrder.getStatus());
        // serviceOrder.setCompletionDate(LocalDateTime.now());
        return osRepository.save(serviceOrder);
    }

    private double calcularTotalDaOS(OrdemDeServico order) {

         double totalItens = order.getItensOS().stream()
                .mapToDouble(item -> item.getValorUnitario() * item.getQuantidade())
                .sum();

        // Se tiver desconto, subtraímos
        double totalComDesconto = totalItens - (order.getDesconto() != null ? order.getDesconto() : 0);

       LOGGER.info("CALCULO TOTA::::>" + totalComDesconto + (order.getPorConta() != null ? order.getPorConta() : 0));
        // Se tiver ao porConta, somar ou subtrair aqui
        return totalComDesconto + (order.getPorConta() != null ? order.getPorConta() : 0);
    }


}
