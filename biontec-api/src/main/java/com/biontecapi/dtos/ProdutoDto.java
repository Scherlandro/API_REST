package com.biontecapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoDto {

    private Integer idProduto;
    private String codProduto;
    private String codDoFabricante;
    private String dtCadastro;
    private String ultimaAtualizacao;
    private String nomeProduto;
    private String corDoProduto;
    private String unidadeMedidas;
    private String obs;
    private Double valorCompra;
    private Double percentual;
    private Double valorVenda;
    private Integer qtdEstoque;
    private Integer estoqueMinimo;
    private Integer qtdVendidas;
    private Integer idFornecedor;
    private Integer iMarca;
    private Integer idModelo;
    private byte[] fotoProduto;

}
