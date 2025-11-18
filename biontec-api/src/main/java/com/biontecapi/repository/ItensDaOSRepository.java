package com.biontecapi.repository;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItensDaOSRepository extends JpaRepository<ItensDoServico,Long> {


    @Query(value = " Select i.idItensDaOS,i.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total " +
            "from Produto p inner join ItensDoServico i " +
            "on i.idItensDaOS = p.idProduto and p.codProduto = ?1 ")
    List<ItensDoServicoDTO> findItensOSByIdProduct(Integer id);

    @Query(value = " Select i from OrdemDeServico o inner join ItensDoServico i "  +
            "where o.idOs = i.ordemDeServico.idOs and o.dataDeEntrada = ?1 ")
    List<ItensDoServicoDTO> litarItensOSPorData(@Param("dtVenda") String dtVenda);

    @Query(value = " Select i from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.idOs = i.ordemDeServico.idOs  " +
            "where STR_TO_DATE(o.dataDeEntrada,'%d/%m/%y')  BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y') ")
    List<ItensDoServicoDTO> litarItensOSEntreData(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);

    @Query("SELECT i FROM ItensDoServico i " +
            "JOIN i.ordemDeServico o " +
            "WHERE DATE(o.dataDeEntrada) BETWEEN :dataInicio AND :dataFim")
    List<ItensDoServico> listarItensOSEntreDatas(@Param("dataInicio") String dataInicio,
                                                 @Param("dataFim") String dataFim);

    // Alternativa mais simples se as datas forem LocalDateTime
    @Query("SELECT i FROM ItensDoServico i " +
            "JOIN i.ordemDeServico o " +
            "WHERE o.dataDeEntrada BETWEEN :dataInicio AND :dataFim")
    List<ItensDoServico> listarItensOSEntreData(@Param("dataInicio") LocalDateTime dataInicio,
                                                @Param("dataFim") LocalDateTime dataFim);

    List<ItensDoServico> findByOrdemDeServico_DataDeEntradaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);



    @Query(value = " Select i from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.idOs = i.ordemDeServico.idOs and trim(o.nomeCliente) like ?1%")
    List<ItensDoServicoDTO> litarItensOSporCliente(@Param("nomeCliente") String nomeCliente);



}
