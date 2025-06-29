package com.biontecapi.repository;

import com.biontecapi.model.Vendas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendasRepository extends JpaRepository<Vendas, Integer> {

   @Query(value = "Select v.id_venda, v.codevenda, v.id_cliente, v.nome_cliente, v.id_funcionario, v.nome_funcionario," +
           " v.dt_venda, v.subtotal, v.desconto, v.totalgeral, v.forma_de_pagamento, v.numero_de_parcelas, i.* " +
           " from Vendas v inner join (select it.id_itens_vd, it.codevendas, it.cod_produtos,it.descricao, it.valor_compra," +
           " it.valor_venda, it.valor_parcial, it.qtd_vendidas from ItensDaVenda it) as i " +
           " on v.codevenda = i.codevendas and v.nome_cliente like ?1% " , nativeQuery = true)
   List<Vendas> findVendasByNomeDoCliente(@Param("nome_cliente") String nome_cliente);


   @Query("Select new com.biontecapi.dtos.VendasDto( v.idVenda, v.idCliente, v.nomeCliente,  " +
           " v.idFuncionario, v.nomeFuncionario, v.dt_venda," +
           " v.subtotal, v.desconto, v.totalgeral, v.formasDePagamento, v.qtdDeParcelas, v.itensVd)" +
           "from Vendas v where v.nomeCliente = ?1 ")
   List<Vendas> findVendasByNomeCliente(@Param("nomeCliente") String nomeCliente);
}
