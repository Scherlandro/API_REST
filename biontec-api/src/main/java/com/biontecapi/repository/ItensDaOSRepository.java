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


    @Query(value = " Select i.idItensDaOS,i.codOS,i.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total " +
            "from Produto p inner join ItensDoServico i " +
            "on i.idItensDaOS = p.idProduto and p.codProduto = ?1 ")
    List<ItensDoServicoDTO> findItensOSByIdProduct(Integer id);

    @Query(value = " Select i.idItensDaOS,i.codOS,i.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total " +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "where o.id_os = i.ordemDeServico.id_os and o.dataDeEntrada = ?1 ")
    List<ItensDoServicoDTO> litarItensOSPorData(@Param("dtVenda") String dtVenda);

    @Query(value = " Select i.idItensDaOS,i.codOS,i.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total " +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.id_os = i.codOS  " +
            "where STR_TO_DATE(o.dataDeEntrada,'%d/%m/%y')  BETWEEN STR_TO_DATE(:dtIni,'%d/%m/%y') AND STR_TO_DATE(:dtFinal,'%d/%m/%y') ")
    List<ItensDoServicoDTO> litarItensOSEntreData(@Param("dtIni") String dtIni, @Param("dtFinal") String dtFinal);

    @Query(value = " Select i.idItensDaOS,i.codOS,i.codProduto," +
            " i.descricao, i.valorUnitario, i.quantidade, i.total " +
            "from OrdemDeServico o inner join ItensDoServico i "  +
            "on o.id_os = i.ordemDeServico.id_os and trim(o.nomeCliente) like ?1%")
    List<ItensDoServicoDTO> litarItensOSporCliente(@Param("nomeCliente") String nomeCliente);



}
