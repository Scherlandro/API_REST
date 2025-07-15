package com.biontecapi.service;

import com.biontecapi.model.Almoxarifado;
import java.util.List;
import java.util.Optional;

public interface AlmoxarifadoService {



    Almoxarifado save(Almoxarifado almoxarifado);

    Optional<Almoxarifado> findById(Integer id);

    List<Almoxarifado> findAll();

    boolean existsByPlaca(String placa);

    boolean existsByDisponibilidade(Boolean disponibilidade) ;



}
