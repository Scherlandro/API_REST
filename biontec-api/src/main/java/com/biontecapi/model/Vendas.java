package com.biontecapi.model;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.dtos.VendasDto;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
/*

@NamedNativeQuery(name = "Vendas.findVendasByNomeDoCliente",
        query = "Select v.id_venda, v.id_cliente, v.nome_cliente, v.id_funcionario, v.nome_funcionario, v.dt_venda," +
                " v.subtotal, v.desconto, v.totalgeral,v.forma_de_pagamento, v.numero_de_parcelas, itensVd.*   " +
                " from Vendas v join (select it.codevendas, it.cod_produtos,it.descricao," +
                " it.valor_compra, it.valor_venda, it.valor_parcial, it.qtd_vendidas from ItensDaVenda it) as itensVd" +
                " on v.id_venda = itensVd.codevendas  where v.nome_cliente = :nome_cliente",
        resultSetMapping = "Mapping.VendasDto" )
@SqlResultSetMapping(name = "Mapping.VendasDto",
        classes = @ConstructorResult(targetClass = Vendas.class,
                columns = {@ColumnResult(name = "id_venda"),@ColumnResult(name = "id_cliente"),@ColumnResult(name = "nome_cliente"),
                        @ColumnResult(name = "id_funcionario"),@ColumnResult(name = "nome_funcionario"),@ColumnResult(name = "dt_venda"),
                        @ColumnResult(name = "subtotal"),@ColumnResult(name = "desconto"),@ColumnResult(name = "totalgeral"),
                        @ColumnResult(name = "forma_de_pagamento"),@ColumnResult(name = "numero_de_parcelas")
                        ,@ColumnResult(name = "itensVd", type = String.class) }))
*/


@Entity
@Table(name = "vendas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venda")
    private Integer idVenda;

    @Column(name = "codevenda", length = 20)
    private String codevenda;

    @Column(name = "id_cliente", length = 11)
    private Integer idCliente;

    @Column(name = "nome_cliente", length = 45)
    private String nomeCliente;

    @Column(name = "id_funcionario", length = 11)
    private Integer idFuncionario;

    @Column(name = "nome_funcionario", length = 45)
    private String nomeFuncionario;

    @Column(name = "dt_venda", length = 10)
    private String dt_venda;

    private Double subtotal;

    private Double desconto;

    private Double totalgeral;

    @Column(name = "forma_de_pagamento", length = 25)
    private String formasDePagamento;

    @Column(name = "numero_de_parcelas", length = 3)
    private Integer qtdDeParcelas;

    @OneToMany
    @JoinColumn(name = "codevendas")
    private Collection<ItensDaVenda> itensVd;
    /*
    @Transient
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_itens_vd")
    private List<ItensDaVenda> itensDaVendaList;

   @Transient
   @OneToMany(mappedBy = "vendas", cascade = CascadeType.ALL, orphanRemoval = true)
      @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
      @JoinTable(name = "vendas", joinColumns = {
      @JoinColumn(name = "fk_Vd_itensVd", referencedColumnName = "cod_venda")},
     inverseJoinColumns = { @JoinColumn(name = "cod_vendas", referencedColumnName = "cod_vendas")})
      private final List<ItensDaVenda> itensDaVendaList;
    }*/
}

