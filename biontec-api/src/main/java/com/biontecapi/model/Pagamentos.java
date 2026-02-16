package com.biontecapi.model;

import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.dtos.PixResponseDTO;
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

    // Campos para vínculo com Efí
    @Column(unique = true)
    private String txid; // Fundamental para o Webhook localizar a cobrança

    @Column(length = 100)
    private String e2eid; // Identificador da transação no Banco Central

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