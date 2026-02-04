package com.biontecapi.model;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.*;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.dtos.VendasDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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

    @Column(name = "id_cliente", length = 11)
    private Integer idCliente;

    @Column(name = "nome_cliente", length = 45)
    private String nomeCliente;

    @Column(name = "id_funcionario", length = 11)
    private Integer idFuncionario;

    @Column(name = "nome_funcionario", length = 45)
    private String nomeFuncionario;

    @Column(name = "dt_venda", length = 10)
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


    public VendasDto toDTO() {
        return new VendasDto(
                this.idVenda,
                this.idCliente,
                this.nomeCliente,
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

   /* public VendasDto toDTO() {
       // Usando o Builder que o Lombok gera para o Record
       return VendasDto.builder()
               .idVenda(this.idVenda)
               .idCliente(this.idCliente)
               .nomeCliente(this.nomeCliente)
               .idFuncionario(this.idFuncionario)
               .nomeFuncionario(this.nomeFuncionario)
               .dtVenda(this.dtVenda)
               .subtotal(this.subtotal)
               .desconto(this.desconto)
               .totalgeral(this.totalgeral)
               .formasDePagamento(this.formasDePagamento)
               .qtdDeParcelas(this.qtdDeParcelas)
               .itensVd(this.itensVd != null ?
                       this.itensVd.stream()
                               .map(ItensDaVenda::toDTO)
                               .collect(Collectors.toList()) :
                       new ArrayList<ItensDaVendaDto>())
               .build();
   }
*/
    @PrePersist
    protected void onCreate() {
       // this.dtVenda = OffsetDateTime.from(LocalDateTime.now());
        this.dtVenda = LocalDateTime.now();
    }

    public void mapToDTO(VendasDto dto) {
        this.idCliente = dto.idCliente();
        this.nomeCliente = dto.nomeCliente();
        this.idFuncionario = dto.idFuncionario();
        this.nomeFuncionario = dto.nomeFuncionario();
        this.desconto = dto.desconto();
        this.subtotal = dto.subtotal();
        // o dtVenda aqui, está setado no @PrePersist!
    }

}