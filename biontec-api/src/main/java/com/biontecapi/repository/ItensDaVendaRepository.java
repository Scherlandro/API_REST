package com.biontecapi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;

@Repository
public interface ItensDaVendaRepository extends JpaRepository<ItensDaVenda, Integer> {

    @Query(value = " Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd,i.codVenda,i.codProduto," +
            " i.descricao, i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda )" +
            "from Vendas v inner join ItensDaVenda i " +
            "on v.codevenda = i.codVenda and v.idVenda = ?1 ")
    List<ItensDaVenda> findItensVdById(Integer id);

    @Query(value = " Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd,i.codVenda,i.codProduto," +
            " i.descricao, i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda )" +
            "from Vendas v inner join ItensDaVenda i " +
            "on v.codevenda =  i.codVenda and v.dtVenda =?1 ")
    List<ItensDaVenda> litarItemDaVendaPorData(@Param("dtVenda") String dtVenda);


    @Query(" select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd, i.codVenda,i.codProduto,i.descricao," +
       " i.valCompra,i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda)" +
       " from Vendas v join ItensDaVenda i on v.codevenda = i.codVenda " +
       " where v.dtVenda between :dtIni and :dtFinal")
    List<ItensDaVenda> litarItemDaVendaEntreData(@Param("dtIni") LocalDateTime dtIni,
            @Param("dtFinal") LocalDateTime dtFinal);

    @Query(" select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd, i.codVenda,i.codProduto,i.descricao," +
       " i.valCompra,i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda)" +
       " from Vendas v join ItensDaVenda i on v.codevenda = i.codVenda " +
       " where v.dtVenda between :dtIni and :dtFinal")
    List<ItensDaVendaDto> listarItensVdPorPeriodo(@Param("dtIni") LocalDateTime dtIni,
            @Param("dtFinal") LocalDateTime dtFinal);


   /* @Query(value = " Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd,i.codVenda,i.codProduto," +
            " i.descricao, i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda )" +
            "from Vendas v inner join ItensDaVenda i on v.codevenda = i.codVenda " +
            "where STR_TO_DATE(v.dtVenda,'%d/%m/%y')  BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y') ")
    List<ItensDaVendaDto> litarItemDaVendaEntreData(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);

    @Query("Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd, i.codVenda, i.codProduto, i.descricao, " +
            "i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda) " +
            "from Vendas v inner join ItensDaVenda i on v.codevenda = i.codVenda " +
            "where STR_TO_DATE(v.dtVenda,'%d/%m/%y') BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y')")
    List<ItensDaVendaDto> litarItensVdPorPeriodo(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);*/


    @Query(value = " Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd,i.codVenda,i.codProduto," +
            " i.descricao, i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, v.dtVenda )" +
            "from Vendas v inner join ItensDaVenda i " +
            "on v.codevenda = i.codVenda and v.nomeCliente = ?1")
    List<ItensDaVenda> litarItemDaVendaPorCliente(@Param("nomeCliente") String nomeCliente);

 /*   @Query(value = " Select new com.biontecapi.dtos.ItensDaVendaDto(i.idItensVd,i.codVenda,i.codProduto," +
            " i.descricao, i.valCompra, i.valVenda, i.qtdVendidas, i.valorParcial, i.dtVenda )" +
            "from Produto p inner join ItensDaVenda i " +
            "on i.idItensVd = p.idProduto and p.codProduto = ?1 ")
    List<ItensDaVendaDto> findItensVdByIdProduct(Integer id);*/

    @Query("select i from Produto p join ItensDaVenda i " +
           " on i.codProduto = p.codProduto " +
            " join Vendas v on v.codevenda = i.codVenda " +
            "where p.codProduto = :codProduto")
            List<ItensDaVenda> findItensVdByIdProduct(@Param("codProduto") Integer codProduto);

  /*  @Query("SELECT offer FROM OfferEntity offer " +
            "   JOIN offer.placeOwnership AS owner " +
            "   JOIN owner.place AS place " +
            "WHERE " +
            "   place.id = :placeId AND " +
            "   to_char(offer.dayFrom, 'yyyy-MM-dd') = :offerDate AND " +
            ^
            <expression>,<operator>, GROUP, HAVING or ORDER expected got '('
            "   offer.repeating = false")
    List<OfferEntity> getAllForDate(@Param("placeId") Long placeId, @Param("offerDate") String offerDate);*/

/*

    @Query("UPDATE ItensDaVenda i SET i.cod_produtos = :cod_produto")
    @Modifying
    void addPrefixToFirstName(@Param("cod_produto") String cod_produto);

*/


}

