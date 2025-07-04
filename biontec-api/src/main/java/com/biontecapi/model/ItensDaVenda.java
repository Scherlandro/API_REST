package com.biontecapi.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "itensdavenda")
@AllArgsConstructor
@NoArgsConstructor
public class ItensDaVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_itens_vd", length = 20)
    private Integer IdItensVd;

    @Column(name = "codevendas", length = 20)
    private String codVenda;

    @Column(name = "cod_produtos",length = 80)
    private String codProduto;

    @Column(length = 120)
    private String descricao;

    @Column(name = "valor_compra",length = 20)
    private Double valCompra;

    @Column(name = "valor_venda",length = 20)
    private Double valor_venda;

    @Column(name = "qtd_vendidas",length = 11)
    private Integer qtdVendidas;

    @Column(name = "valor_parcial",length = 20)
    private Double valor_parcial;

    @Column(name = "dt_registro",length = 20)
    private Date dtRegistro;



   /* @Transient
    @ManyToOne
    @JoinTable(name = "vendas", joinColumns = {
            @JoinColumn(name = "fk_Vd_itensVd", referencedColumnName = "codVenda")},
            inverseJoinColumns = {
                    @JoinColumn(name = "codVendas", referencedColumnName = "codVendas")})
    private Vendas venda ;*/
}
