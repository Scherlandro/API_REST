package com.biontecapi.dtos;

public record ItensDaVendaDto (
     Integer IdItensVd,
     String codVenda,
     String codProduto,
     String descricao,
     Double valCompra,
     Double valVenda,
     Integer qtdVendidas,
     Double valorParcial,
     String dtRegistro
){ }
