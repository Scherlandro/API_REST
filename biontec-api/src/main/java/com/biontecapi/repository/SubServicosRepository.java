package com.biontecapi.repository;

import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.model.SubServicos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubServicosRepository extends JpaRepository<SubServicos,Long> {

    List<SubServicos> findByNumeracao(String numero);



}
