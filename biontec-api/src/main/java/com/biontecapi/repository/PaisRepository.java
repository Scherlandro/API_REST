package com.biontecapi.repository;

import com.biontecapi.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Integer> {

  @Query(value = "select p from Pais p where trim(p.nome_pais) like %?1")
  List<Pais> busarPorNome_pais(String nome_pais);
}
