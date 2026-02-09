package com.biontecapi.model;

import com.biontecapi.dtos.PagamentosDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pagamentos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPagamento;

    private Double valorPago;

    private LocalDateTime dtPagamento;

    @Column(length = 25)
    private String formaPagamento; // Dinheiro, Cartão, Pix

    private Integer status; // 0-Pendente, 1-Pago, 2-Cancelado

    // Campos para vínculo genérico
    private Integer origemId; // ID da Venda, ID da OS, etc.
    private String tipoOrigem; // "VENDA", "SERVICO"

    @PrePersist
    protected void onCreate() {
        this.dtPagamento = LocalDateTime.now();
    }

    public PagamentosDto toDTO() {
        return new PagamentosDto(
                this.idPagamento,
                this.valorPago,
                this.dtPagamento,
                this.formaPagamento,
                this.status,
                this.origemId,
                this.tipoOrigem
        );
    }
}