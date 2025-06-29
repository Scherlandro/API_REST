package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.repository.ItensDaVendaRepository;
import com.biontecapi.service.ItensDaVendaService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ItenDaVendaServiceImpl implements ItensDaVendaService {


    final ItensDaVendaRepository itensDaVendaRepository;

    public ItenDaVendaServiceImpl(ItensDaVendaRepository repository) {

        this.itensDaVendaRepository = repository;
    }


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
    public List<ItensDaVendaDto> listarItensDaVdPorId(Integer id){
        return itensDaVendaRepository.findItensVdById(id);
    }

    @Override
    public List<ItensDaVendaDto> ConsultarItensVdEntreDatas(String dtIni, String dtFinal) {
        return itensDaVendaRepository.litarItemDaVendaEntreData(dtIni, dtFinal);
    }

    @Override
    public List<ItensDaVendaDto> litarItemDaVendaPorData(String dt) {
        return itensDaVendaRepository.litarItemDaVendaPorData(dt);
    }

    @Override
    public List<ItensDaVendaDto> litarItemDaVendaPorCliente(String nome) {
        return itensDaVendaRepository.litarItemDaVendaPorCliente(nome);
    }

/*
    @Override
    public List<ItensDaVendaDto> litarItemDaVendaPorCod(String codevendas) {
        return itensDaVendaRepository.litarItemDaVendaPorCod(codevendas);
    }

    @Override
    public boolean existsIten(String item) {
        return ItensDaVendaRepository.existsItem(item);
    }
    @Override
    public boolean existsByDisponibilidade(Boolean disponibilidade) {
        return itensDaVendaRepository.existsByDisponibilidade(disponibilidade);
    }

    */

}
