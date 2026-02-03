package com.biontecapi.dtos;

import java.time.LocalDateTime;

public record ItensDaVendaDto (
     Integer idItensVd,
     String codVenda,
     String codProduto,
     String descricao,
     Double valCompra,
     Double valVenda,
     Integer qtdVendidas,
     Double valorParcial,
     LocalDateTime dtRegistro
){ }
