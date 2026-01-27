package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.mapper.ItensDaVendaMapper;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.repository.ItensDaVendaRepository;
import com.biontecapi.service.ItensDaItensDaVendaervice;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ItenDaItensDaVendaerviceImpl implements ItensDaItensDaVendaervice {


    private final ItensDaVendaRepository itensDaVendaRepository;
    private final ItensDaVendaMapper mapper;

    public ItenDaItensDaVendaerviceImpl(ItensDaVendaRepository repository,
                                  ItensDaVendaMapper mapper) {

        this.itensDaVendaRepository = repository;
        this.mapper = mapper;
    }

/*   public boolean existsIten(String item) { return ItensDaVendaRepository.existsItem(item);    }
    public boolean existsByDisponibilidade(Boolean disponibilidade) { return itensDaVendaRepository.existsByDisponibilidade(disponibilidade); }
    */

    @Transactional
    public ItensDaVenda save(ItensDaVenda itensDaVenda) {
        return itensDaVendaRepository.save(itensDaVenda);
    }

    @Override
    public List<ItensDaVenda> findAll() {

        return itensDaVendaRepository.findAll();
    }

    @Override
    public Optional<ItensDaVenda> findById(Integer id) {
        return itensDaVendaRepository.findById(id);
    }

    @Override
    public List<ItensDaVenda> listarItensDaVdPorId(Integer id){
        return itensDaVendaRepository.findItensVdById(id);
    }

    @Override
    public List<ItensDaVenda> listarItensVdPorIdProduto(Integer id) {
        return itensDaVendaRepository.findItensVdByIdProduct(id); }

    @Override
    public List<ItensDaVenda> ConsultarItensVdEntreDatas(LocalDateTime dtIni, LocalDateTime dtFinal) {
        return itensDaVendaRepository.litarItemDaVendaEntreData(dtIni, dtFinal);
    }

    @Override
    public List<ItensDaVenda> litarItemDaVendaPorData(String dt) {
        return itensDaVendaRepository.litarItemDaVendaPorData(dt);
    }

    @Override
    public List<ItensDaVenda> litarItemDaVendaPorCliente(String nome) {
        return itensDaVendaRepository.litarItemDaVendaPorCliente(nome);
    }

    @Override
    public ItensDaVenda save(ItensDaVendaDto dto) {
        ItensDaVenda vd = itensDaVendaRepository.findById(dto.IdItensVd())
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        vd.mapToDTO(dto);
        vd.setValorParcial(calcularValorParcial(vd));
        return itensDaVendaRepository.save(vd);
    }

    @Override
    public ItensDaVenda atualizarVenda(ItensDaVendaDto dto) {

        ItensDaVenda vd = itensDaVendaRepository.findById(dto.IdItensVd())
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        vd.mapToDTO(dto);
        vd.setValorParcial(calcularValorParcial(vd));
        return itensDaVendaRepository.save(vd);
    }


    private Double calcularValorParcial(ItensDaVenda itenVd) {

        double totalItens = itenVd.getIdItensVd().stream()
                .mapToDouble(item -> item.getValVenda() * item.getQtdVendidas()).sum();

        return totalItens; 
    }


}
