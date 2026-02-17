package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.mapper.OrdemDeServicoMapper;
import com.biontecapi.model.Cliente;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.repository.*;
import com.biontecapi.service.OrdemDeServicoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class OrdemDeServicoServiceImpl implements OrdemDeServicoService {

    final OrdemDeServicosRepository osRepository;
    final ItensDaOSRepository itensDaOSRepository;
    final OrdemDeServicoMapper osMapper;
    private final ClienteRepository clienteRepository;
  // private static Logger LOGGER = LoggerFactory.getLogger(OrdemDeServicoServiceImpl.class);

    public OrdemDeServicoServiceImpl(OrdemDeServicosRepository osRepository,
                                     ItensDaOSRepository itensDaOSRepository,
                                     OrdemDeServicoMapper osMapper, ClienteRepository clienteRepository) {
        this.osRepository = osRepository;
        this.itensDaOSRepository = itensDaOSRepository;
        this.osMapper = osMapper;
        this.clienteRepository = clienteRepository;
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
        order.mapToDTO(dto);
        if (dto.cliente() != null && dto.cliente().id_cliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.cliente().id_cliente())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            order.setCliente(cliente);
            order.setNomeCliente(cliente.getNomeCliente()); // Opcional: sincroniza o nome
        }
        return osRepository.save(order);
    }

    @Override
    public OrdemDeServico atualizarOS(OrdemDeServicoDTO dto) {

        OrdemDeServico order = osRepository.findById(dto.idOS())
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        order.mapToDTO(dto);
        order.setStatus(dto.status());
        order.setTotalGeralOS(calcularTotalDaOS(order));
        return osRepository.save(order);
    }


    @Override
    public OrdemDeServico addItemNaOS(Long osID, ItensDoServicoDTO itemDto) {
        OrdemDeServico order = osRepository.findById(osID).orElseThrow();
        calcularTotalDaOS(order);
        return osRepository.save(order);
    }

/*    @Override
    @Transactional
    public OrdemDeServico salvarOSComParcelas(OrdemDeServicoDTO dto) {
        // 1. Salva a OS normalmente
        OrdemDeServico osSalva = osRepository.save(osMapper.toEntity(dto));

        // 2. Se for parcelado, gera o Contas a Receber
        if (osSalva.getQtdDeParcelas() > 1) {
            double valorParcela = osSalva.getTotalGeralOS() / osSalva.getQtdDeParcelas();

            for (int i = 1; i <= osSalva.getQtdDeParcelas(); i++) {
                ContasAReceber conta = new ContasAReceber();
                conta.setOrigemId(osSalva.getIdOS());
                conta.setTipoOrigem("VENDA");
                conta.setNumeroParcela(i);
                conta.setValorParcela(valorParcela);
                conta.setDataVencimento(LocalDate.now().plusMonths(i));
                conta.setStatus("PENDENTE");

                //contasAReceberRepository.save(conta);
            }
        }
        return osSalva;
    }*/

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


    private double calcularTotalDaOS(OrdemDeServico order) {

         double totalItens = order.getItensOS().stream()
                .mapToDouble(item -> item.getValorUnitario() * item.getQuantidade()).sum();
        // Se tiver desconto, subtraímos
        double totalComDesconto = totalItens - (order.getDesconto() != null ? order.getDesconto() : 0);

   //    LOGGER.info("CALCULO TOTA::::>" + totalComDesconto + (order.getPorConta() != null ? order.getPorConta() : 0));
        // Se tiver ao porConta, somar ou subtrair aqui
        return totalComDesconto + (order.getPorConta() != null ? order.getPorConta() : 0);
    }


}
