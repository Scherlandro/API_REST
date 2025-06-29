package com.biontecapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "produto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto implements Serializable {
    private static final long serialversionUID= 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Integer idProduto;

    @Column(length = 20, name = "cod_produto")
    private String codProduto;

    @Column(length = 20, name = "codDofabricante")
    private String codDoFabricante;

    @JsonFormat(pattern = "dd/MM/yyyy")
   @Column(length = 10, name = "inicio_cadastro")
    private String dtCadastro;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(length = 10, name = "ultima_atualizacao")
    private String ultimaAtualizacao;

    @Column( length = 60, name = "nome_produto")
    private String nomeProduto;

    @Column(length = 45,name = "corDoproduto")
    private String corDoProduto;

    @Column(length = 4, name = "unidadeMedidas")
    private String unidadeMedidas;

    @Column(length = 300)
    private String obs;

    @Column( length = 30,name = "valor_compra")
    private Double valorCompra;

    @Column( length = 20)
    private Double percentual;

    @Column( length = 30, name = "valor_venda")
    private Double valorVenda;

    @Column( length = 11, name = "quantidade_estoque")
    private Integer qtdEstoque;

    @Column( length = 11, name = "estoque_minimo")
    private Integer estoqueMinimo;

    @Column(length = 11, name = "qtd_vendidas")
    private Integer qtdVendidas;

   @Column(length = 11, name = "id_fornecedor")
    private Integer idFornecedor;

    @Column(length = 11,name = "id_marca")
    private Integer idMarca;

    @Column(length = 11, name = "id_modelo")
    private Integer idModelo;

    @Lob
    @Column(length = 100000, name = "foto_produto")
    private byte[] fotoProduto;
}
