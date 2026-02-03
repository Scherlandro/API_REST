package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.mapper.ItensDaVendaMapper;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.repository.ItensDaVendaRepository;
import com.biontecapi.service.ItensDaVendaService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ItenDaVendaServiceImpl implements ItensDaVendaService {


    private final ItensDaVendaRepository itensDaVendaRepository;
    private final ItensDaVendaMapper mapper;

    public ItenDaVendaServiceImpl(ItensDaVendaRepository repository,
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
    @Transactional
    public ItensDaVenda save(ItensDaVendaDto dto) {
        ItensDaVenda item;
        if (dto.idItensVd() == null || dto.idItensVd() == 0) {
            item = new ItensDaVenda();
        } else {
            item = itensDaVendaRepository.findById(dto.idItensVd())
                    .orElseThrow(() -> new RuntimeException("Item não encontrado para atualizar"));
        }
        item.mapToDTO(dto);
        item.setValorParcial(calcularValorParcial(item));
        return itensDaVendaRepository.save(item);
    }

    @Override
    @Transactional
    public ItensDaVenda atualizarItensDaVenda(ItensDaVendaDto dto) {
        return this.save(dto);
    }

    private Double calcularValorParcial(ItensDaVenda itenVd) {
        if (itenVd.getValVenda() == null || itenVd.getQtdVendidas() == null) return 0.0;
        return itenVd.getValVenda() * itenVd.getQtdVendidas();
    }

   @Override
    public void deletar(Integer id) {
       itensDaVendaRepository.deleteById(id);
    }

}
