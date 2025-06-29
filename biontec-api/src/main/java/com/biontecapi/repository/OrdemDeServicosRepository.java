package com.biontecapi.repository;


import com.biontecapi.model.OrdemDeServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdemDeServicosRepository extends JpaRepository<OrdemDeServico, Long> {

    List<OrdemDeServico> findByNomeCliente(String name);

    List<OrdemDeServico> findByStatus(String status);

    @Query("SELECT o FROM OrdemDeServico o WHERE o.dataDeEntrada BETWEEN :start AND :end")
    List<OrdemDeServico> findByDataDeEntradaBetween(@Param("start") String start, @Param("end") String end);


   /* @Query("SELECT o FROM OrdemDeServico o JOIN o.subservicos s WHERE s.numeracao = :numeracao")
    List<OrdemDeServico> findByNumeracao(@Param("numeracao") String numeracao);*/

}
