package com.biontecapi.repository;


import com.biontecapi.model.Almoxarifado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlmoxarifadoRepository extends JpaRepository<Almoxarifado, Integer> {

    boolean existsByPlaca(String placa);

    boolean existsByDisponibilidade(Boolean disponibilidade);
}
