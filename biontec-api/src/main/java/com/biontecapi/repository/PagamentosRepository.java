package com.biontecapi.repository;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.model.Pagamentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagamentosRepository extends JpaRepository<Pagamentos, Integer> {
    // Busca pagamentos vinculados a uma venda específica
    List<Pagamentos> findByOrigemIdAndTipoOrigem(Integer origemId, String tipoOrigem);

    @Query("SELECT new com.biontecapi.dtos.FechamentoCaixaDto(p.formaPagamento, SUM(p.valorPago), COUNT(p)) " +
            "FROM Pagamentos p " +
            "WHERE p.dtPagamento BETWEEN :inicio AND :fim " +
            "AND p.status = 1 " + // Apenas pagamentos confirmados
            "GROUP BY p.formaPagamento")
    List<FechamentoCaixaDto> resumoFechamento(@Param("inicio") LocalDateTime inicio,
                                              @Param("fim") LocalDateTime fim);

    Optional<Pagamentos> findByTxid(String txid);
}

