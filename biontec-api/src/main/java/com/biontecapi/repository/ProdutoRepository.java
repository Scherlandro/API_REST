package com.biontecapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.biontecapi.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

   @Query(value = "select p from Produto p where trim(p.nome_produto) like %?1%")
    Optional<Produto>listarProdutoPorDescricao(@Param("nome_produto")String nome_produto);

    @Query(value = "Select p from Produto p" +
            " where trim(p.nomeProduto) like ?1%")
    List<Produto>listarProdutoPorNome(@Param("nomeProduto")String nomeProduto);
}
