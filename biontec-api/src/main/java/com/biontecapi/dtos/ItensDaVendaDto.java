package com.biontecapi.dtos;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record ItensDaVendaDto (
     Integer idItensVd,
     Integer codVenda,
     String codProduto,
     String descricao,
     Double valCompra,
     Double valVenda,
     Integer qtdVendidas,
     Double valorParcial,
     LocalDateTime dtRegistro
){ }
