package com.biontecapi.repository;

import com.biontecapi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

/*    @Query(value = "select p from Produto p where trim(p.nome_produto) like %?1%")
    Optional<Produto>listarProdutoPorNome2(@Param("nome_produto")String nome_produto);*/

    @Query(value = "Select p from Produto p" +
            " where trim(p.nomeProduto) like ?1%")
    List<Produto>listarProdutoPorNome(@Param("nomeProduto")String nomeProduto);
}
