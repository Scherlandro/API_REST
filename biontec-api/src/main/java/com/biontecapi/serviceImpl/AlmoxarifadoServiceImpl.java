package com.biontecapi.serviceImpl;

import com.biontecapi.model.Almoxarifado;
import com.biontecapi.repository.AlmoxarifadoRepository;
import com.biontecapi.service.AlmoxarifadoService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AlmoxarifadoServiceImpl implements AlmoxarifadoService {

    final AlmoxarifadoRepository almoxarifadoRepository;

    public AlmoxarifadoServiceImpl(AlmoxarifadoRepository repository) {  this.almoxarifadoRepository = repository;  }

    @Transactional
    public Almoxarifado save(Almoxarifado almoxarifado) { return almoxarifadoRepository.save(almoxarifado);  }

    @Override
    public Optional<Almoxarifado> findById(Integer id) {
        return almoxarifadoRepository.findById(id);
    }

    @Override
    public List<Almoxarifado> findAll() {
        return almoxarifadoRepository.findAll();
    }

    @Override
    public boolean existsByPlaca(String placa) {
        return almoxarifadoRepository.existsByPlaca(placa);
    }

    @Override
    public boolean existsByDisponibilidade(Boolean disponibilidade) {
        return almoxarifadoRepository.existsByDisponibilidade(disponibilidade);
    }
}
