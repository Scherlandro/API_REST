package com.biontecapi.repository;


import com.biontecapi.model.OrdemDeServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrdemDeServicosRepository extends JpaRepository<OrdemDeServico, Long> {

    List<OrdemDeServico> findByNomeCliente(String name);

    List<OrdemDeServico> findByStatus(String status);

    @Query("SELECT o FROM OrdemDeServico o WHERE o.dataDeEntrada BETWEEN :start AND :end")
    List<OrdemDeServico> findByDataDeEntradaBetween(@Param("start") String start, @Param("end") String end);



}
