package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import com.biontecapi.service.ItensOSService;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public class ItensOSServiceImpl implements ItensOSService {


    final ItensDoServicoRepository ItensDoServicoRepository;

    public ItensOSServiceImpl(ItensDoServicoRepository repository) {
        this.ItensDoServicoRepository = repository;
    }

/*   public boolean existsIten(String item) { return ItensDoServicoRepository.existsItem(item);    }
    public boolean existsByDisponibilidade(Boolean disponibilidade) { return ItensDoServicoRepository.existsByDisponibilidade(disponibilidade); }
    */

    @Transactional
    public ItensDoServico save(ItensDoServico ItensDoServico) {
        return ItensDoServicoRepository.save(ItensDoServico);
    }

    @Override
    public List<ItensDoServico> findAll() {
        return ItensDoServicoRepository.findAll();
    }

    @Override
    public Optional<ItensDoServico> findById(Integer id) {
        return ItensDoServicoRepository.findById(id);
    }

    @Override
    public List<ItensDoServicoDTO> listarItensDaVdPorId(Integer id){
        return ItensDoServicoRepository.findItensVdById(id);
    }

    @Override
    public List<ItensDoServicoDTO> listarItensVdPorIdProduto(Integer id) { return ItensDoServicoRepository.findItensVdByIdProduct(id); }

    @Override
    public List<ItensDoServicoDTO> ConsultarItensVdEntreDatas(String dtIni, String dtFinal) {
        return ItensDoServicoRepository.litarItemDaVendaEntreData(dtIni, dtFinal);
    }

    @Override
    public List<ItensDoServicoDTO> litarItemDaVendaPorData(String dt) {
        return ItensDoServicoRepository.litarItemDaVendaPorData(dt);
    }

    @Override
    public List<ItensDoServicoDTO> litarItemDaVendaPorCliente(String nome) {
        return ItensDoServicoRepository.litarItemDaVendaPorCliente(nome);
    }



}
