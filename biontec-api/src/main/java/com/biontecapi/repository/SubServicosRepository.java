package com.biontecapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubServicosRepository extends JpaRepository<SubServicos,Long> {

    List<SubServicos> findByNumeracao(String numero);

}
