package com.biontecapi.model;


import com.biontecapi.dtos.VendasDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Column(name = "nome_cliente", length = 45)
    private String nomeCliente;

    @Column(name = "id_funcionario", length = 11)
    private Integer idFuncionario;

    @Column(name = "nome_funcionario", length = 45)
    private String nomeFuncionario;

    @Column(name = "dt_venda")
    private LocalDateTime dtVenda;

    private Double subtotal;
    private Double desconto;
    private Double totalgeral;

    @Column(name = "forma_de_pagamento", length = 25)
    private String formasDePagamento;

    @Column(name = "numero_de_parcelas", length = 3)
    private Integer qtdDeParcelas;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "codevendas")
    private Collection<ItensDaVenda> itensVd;

    @PrePersist
    protected void onCreate() {
        this.dtVenda = LocalDateTime.now();
    }

    public VendasDto toDTO() {
        return new VendasDto(
                this.idVenda,
                this.cliente != null ? this.cliente.toDTO() : null,
                this.idFuncionario,
                this.nomeFuncionario,
                this.dtVenda,
                this.subtotal,
                this.desconto,
                this.totalgeral,
                this.formasDePagamento,
                this.qtdDeParcelas,
                this.itensVd != null
                        ? this.itensVd.stream()
                        .map(ItensDaVenda::toDTO)
                        .toList()
                        : List.of()
        );
    }

    public void mapToDTO(VendasDto dto) {
        if (dto.cliente() != null) {
            this.cliente = new Cliente();
            this.cliente.setId_cliente(dto.cliente().id_cliente());
        }
        this.idFuncionario = dto.idFuncionario();
        this.nomeFuncionario = dto.nomeFuncionario();
        this.desconto = dto.desconto();
        this.subtotal = dto.subtotal();
    }
}
