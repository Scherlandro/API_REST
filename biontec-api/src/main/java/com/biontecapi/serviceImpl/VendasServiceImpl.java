package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.VendasDto;
import com.biontecapi.mapper.VendasMapper;
import com.biontecapi.model.Cliente;
import com.biontecapi.model.ContasAReceber;
import com.biontecapi.model.Vendas;
import com.biontecapi.repository.ClienteRepository;
import com.biontecapi.repository.VendasRepository;
import com.biontecapi.service.ContasAReceberService;
import com.biontecapi.service.VendasService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VendasServiceImpl implements VendasService {
    final VendasRepository vendasRepository;
    final ContasAReceberService contasAReceberService;
    final VendasMapper vendasMapper;
    private final ClienteRepository clienteRepository;

    public VendasServiceImpl(VendasRepository repository, ContasAReceberService contasAReceberService, VendasMapper mapper, ClienteRepository clienteRepository) {

        this.vendasRepository = repository;
        this.contasAReceberService = contasAReceberService;
        this.vendasMapper = mapper;
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Vendas> listarVendas() {

        return vendasRepository.findAll();
    }


    @Override
    public Optional<Vendas> litarVendaPorCod(Integer id) {
        return vendasRepository.findById(id);
    }

    @Override
    public List<Vendas> litarVendaPorCliente(String nome_cliente) {
        return vendasRepository.findVendasByNomeDoCliente(nome_cliente);
    }

    @Override
    public VendasDto findById(Integer id) {
        Vendas venda = vendasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
        return vendasMapper.toDto(venda);
    }

    @Override
    public Vendas save(VendasDto dto) {
        Vendas vd = new Vendas();
        vd.mapToDTO(dto);
        if (dto.cliente() != null && dto.cliente().id_cliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.cliente().id_cliente())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            vd.setCliente(cliente);
            vd.setNomeCliente(cliente.getNomeCliente());
        }
        Vendas vendaSalva = vendasRepository.save(vd);
        // Se a venda for parcelada (ex: mais de 1 parcela), gera o contas a receber
        if (vendaSalva.getQtdDeParcelas() != null && vendaSalva.getQtdDeParcelas() > 1) {
            contasAReceberService.gerarParcelasVenda(vendaSalva);
        }

        return vendaSalva;
    }
    

    @Override
    public Vendas atualizarVenda(VendasDto dto) {

        Vendas vd = vendasRepository.findById(dto.idVenda())
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        vd.mapToDTO(dto);
        vd.setTotalgeral(calcularTotalDaVenda(vd));
        return vendasRepository.save(vd);
    }

    @Override
    @Transactional
    public Vendas salvarVendaComParcelas(VendasDto dto) {
        // 1. Salva a Venda normalmente
        Vendas vendaSalva = vendasRepository.save(vendasMapper.toEntity(dto));

        // 2. Se for parcelado, gera o Contas a Receber
        if (vendaSalva.getQtdDeParcelas() > 1) {
            double valorParcela = vendaSalva.getTotalgeral() / vendaSalva.getQtdDeParcelas();

            for (int i = 1; i <= vendaSalva.getQtdDeParcelas(); i++) {
                ContasAReceber conta = new ContasAReceber();
                conta.setOrigemId(vendaSalva.getIdVenda());
                conta.setTipoOrigem("VENDA");
                conta.setNumeroParcela(i);
                conta.setValorParcela(valorParcela);
                conta.setDataVencimento(LocalDate.now().plusMonths(i));
                conta.setStatus("PENDENTE");

                //contasAReceberRepository.save(conta);
            }
        }
        return vendaSalva;
    }


    @Override
    public void delete(Integer id) {
        vendasRepository.deleteById(id);
    }
    

    private Double calcularTotalDaVenda(Vendas vd) {

         double totalItens = vd.getItensVd().stream()
                .mapToDouble(item -> item.getValVenda() * item.getQtdVendidas()).sum();
        // Se tiver desconto, subtraímos
        double totalComDesconto = totalItens - (vd.getDesconto() != null ? vd.getDesconto() : 0);

    //   LOGGER.info("CALCULO TOTA::::>" + totalComDesconto + (vd.getPorConta() != null ? vd.getPorConta() : 0));
        // Se tiver ao porConta, somar ou subtrair aqui
        return totalComDesconto; // + (vd.getPorConta() != null ? vd.getPorConta() : 0);
    }



}
