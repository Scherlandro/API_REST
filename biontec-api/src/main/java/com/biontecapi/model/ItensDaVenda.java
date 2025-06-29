package com.biontecapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "itensdavenda")
@AllArgsConstructor
@NoArgsConstructor
public class ItensDaVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_itens_vd;

    @Column(name = "codevendas", length = 20)
    private String codevendas;

    @Column(length = 20)
    private String cod_produtos;

    @Column(length = 60)
    private String descricao;

    private Double valor_compra;

    private Double valor_venda;

    private Double valor_parcial;

    @Column(length = 11)
    private Integer qtd_vendidas;


    // @Transient
  /*  (Muitos IntensDaVenda(classeLocal) para Uma Venda(atributo referido)
     Uma venda pode ter vários itensDeVenda*/


   /* @Transient
    @ManyToOne
    @JoinTable(name = "vendas", joinColumns = {
            @JoinColumn(name = "fk_Vd_itensVd", referencedColumnName = "codVenda")},
            inverseJoinColumns = {
                    @JoinColumn(name = "codVendas", referencedColumnName = "codVendas")})
    private Vendas venda ;*/
}
