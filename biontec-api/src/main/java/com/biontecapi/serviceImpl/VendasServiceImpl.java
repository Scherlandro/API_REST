package com.biontecapi.serviceImpl;


import com.biontecapi.dtos.VendasDto;
import com.biontecapi.mapper.VendasMapper;
import com.biontecapi.model.Vendas;
import com.biontecapi.repository.VendasRepository;
import com.biontecapi.service.VendasService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendasServiceImpl implements VendasService {
    final VendasRepository vendasRepository;
    final VendasMapper vendasMapper;

    public VendasServiceImpl(VendasRepository repository, VendasMapper mapper) {

        this.vendasRepository = repository;
        this.vendasMapper = mapper;
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
        return vendasRepository.save(vd);
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
