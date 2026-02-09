package com.biontecapi.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "contas_a_receber")
@Data
public class ContasAReceber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idContaReceber;

    private Integer origemId; // ID da Venda
    private String tipoOrigem; // "VENDA"

    private Integer numeroParcela;
    private Double valorParcela;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento; // Preenchido apenas quando quitado

    private String status; // "PENDENTE", "PAGO", "ATRASADO"
}