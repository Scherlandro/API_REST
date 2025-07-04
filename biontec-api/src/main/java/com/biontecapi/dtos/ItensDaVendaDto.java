package com.biontecapi.dtos;


import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Transient;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItensDaVendaDto {

    private Integer IdItensVd;
    private String codVenda;
    private String codProduto;
    private String descricao;
    private Double valCompra;
    private Double valVenda;
    private Integer qtdVendidas;
    private Double valorParcial;
    @Transient
    private String dtRegistro;

}
