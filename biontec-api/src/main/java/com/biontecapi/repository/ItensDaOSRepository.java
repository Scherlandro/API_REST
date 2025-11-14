package com.biontecapi.repository;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItensDaOSRepository extends JpaRepository<ItensDoServico,Long> {

    @Query(value = " Select new com.biontecapi.dtos.ItensDoServicoDTO(i.idItensDaOS,i.codOS,i.prod.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total)" +
            "from Produto p inner join ItensDoServico i " +
            "on i.idItensDaOS = p.idProduto and p.codProduto = ?1 ")
    List<ItensDoServicoDTO> findItensOSByIdProduct(Integer id);

    @Query(value = " Select new com.biontecapi.dtos.ItensDoServicoDTO(i.idItensDaOS,i.codOS,i.prod.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total)" +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.id_os = i.codOS and o.dataDeEntrada = ?1 ")
    List<ItensDoServicoDTO> litarItensOSPorData(@Param("dtVenda") String dtVenda);


    @Query(value = "  Select new com.biontecapi.dtos.ItensDoServicoDTO(i.idItensDaOS,i.codOS,i.prod.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total)" +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.id_os = i.codOS " +
            "where STR_TO_DATE(v.dtVenda,'%d/%m/%y')  BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y') ")
    List<ItensDoServicoDTO> litarItensOSEntreData(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);

    @Query(value = " Select new com.biontecapi.dtos.ItensDoServicoDTO(i.idItensDaOS,i.codOS,i.prod.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total)" +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.id_os = i.codOS and o.nomeCliente = ?1")
    List<ItensDoServicoDTO> litarItensOSporCliente(@Param("nomeCliente") String nomeCliente);


    /*
    @Query("Select new com.biontecapi.dtos.ItensDaVendaDto(i.IdItensVd, i.codVenda, i.codProduto, i.descricao, " +
            "i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda) " +
            "from Vendas v inner join ItensDaVenda i on v.codevenda = i.codVenda " +
            "where STR_TO_DATE(v.dtVenda,'%d/%m/%y') BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y')")
    List<ItensDaVendaDto> litarItensVdPorPeriodo(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);




     */


}
