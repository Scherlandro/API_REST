package com.biontecapi.service;

import com.biontecapi.dtos.ProdutoDto;
import com.biontecapi.model.Produto;

import java.util.List;
import java.util.Optional;

public interface ProdutoService {

    List<Produto> listarProduto();
    Produto save(ProdutoDto produtoDto);
    Optional<Produto> litarProdutoPorCod(Integer id);
    List<Produto> listarProdutoPorNome(String nome);
    Optional<Produto> findById(Integer id);
    Boolean existsById(Integer id);
    void delete(Integer id);

}
