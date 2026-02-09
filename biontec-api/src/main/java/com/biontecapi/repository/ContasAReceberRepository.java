package com.biontecapi.repository;

import com.biontecapi.model.ContasAReceber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContasAReceberRepository extends JpaRepository<ContasAReceber, Integer> {

    // Busca todas as parcelas de uma venda específica
    List<ContasAReceber> findByOrigemIdAndTipoOrigem(Integer origemId, String tipoOrigem);

    // Busca parcelas por status (ex: "PENDENTE", "PAGO")
    List<ContasAReceber> findByStatus(String status);

    // Consulta para Inadimplência: Pendentes e com data de vencimento menor que hoje
    @Query("SELECT c FROM ContasAReceber c WHERE c.status = 'PENDENTE' AND c.dataVencimento < :hoje")
    List<ContasAReceber> buscarContasAtrasadas(@Param("hoje") LocalDate hoje);

    // Busca parcelas que vencem em um intervalo de datas (para fluxo de caixa futuro)
    List<ContasAReceber> findByDataVencimentoBetween(LocalDate inicio, LocalDate fim);
}