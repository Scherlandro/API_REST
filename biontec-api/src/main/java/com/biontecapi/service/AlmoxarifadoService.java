package com.biontecapi.service;

import com.biontecapi.model.Almoxarifado;
import com.biontecapi.repository.AlmoxarifadoRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AlmoxarifadoService {

    final AlmoxarifadoRepository almoxarifadoRepository;

    public AlmoxarifadoService(AlmoxarifadoRepository repository) {

        this.almoxarifadoRepository = repository;
    }


    @Transactional
    public Almoxarifado save(Almoxarifado almoxarifado) {

        return almoxarifadoRepository.save(almoxarifado);
    }

    public Optional<Almoxarifado> findById(Integer id) {
        return almoxarifadoRepository.findById(id);
    }

    public List<Almoxarifado> findAll() {
        return almoxarifadoRepository.findAll();
    }

    public boolean existsByPlaca(String placa) {
        return almoxarifadoRepository.existsByPlaca(placa);
    }

    public boolean existsByDisponibilidade(Boolean disponibilidade) {
        return almoxarifadoRepository.existsByDisponibilidade(disponibilidade);
    }
}
