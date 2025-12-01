package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import com.biontecapi.repository.ItensDaOSRepository;
import com.biontecapi.service.ItensOSService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ItensOSServiceImpl implements ItensOSService {


    final ItensDaOSRepository itensDaOSRepository;

    public ItensOSServiceImpl(ItensDaOSRepository repository) {
        this.itensDaOSRepository = repository;
    }

    @Override
    public boolean existsById(Long id) {
        return itensDaOSRepository.existsById(id);
    }


    @Override
    public ItensDoServico saveItemOS(ItensDoServico itensDoServico) {
        return itensDaOSRepository.save(itensDoServico);
    }

    @Override
    public ItensDoServico updateItemOS(ItensDoServico itensDoServico) {
        return itensDaOSRepository.save(itensDoServico);
    }

    @Override
    public List<ItensDoServico> findAll() {
        return itensDaOSRepository.findAll();
    }

    @Override
    public Optional<ItensDoServico> findById(Long id) {
        return itensDaOSRepository.findById(id);
    }

    @Override
    public List<ItensDoServicoDTO> listarItensOSPorIdProduto(Integer id) {
        return itensDaOSRepository.findItensOSByIdProduct(id); }


    @Override
    public List<ItensDoServicoDTO> litarItensOSPorData(String dt) {
        return itensDaOSRepository.litarItensOSPorData(dt);
    }

    @Override
    public List<ItensDoServicoDTO> ConsultarItensOSEntreDatas(String dtIni, String dtFinal) {
        return itensDaOSRepository.litarItensOSEntreData(dtIni, dtFinal);
    }

    @Override
    public List<ItensDoServicoDTO> litarItemOSPorCliente(String nome) {
        return itensDaOSRepository.litarItensOSporCliente(nome);
    }

    @Override
    public void delete(Long id) {
        itensDaOSRepository.deleteById(id);
    }

}
