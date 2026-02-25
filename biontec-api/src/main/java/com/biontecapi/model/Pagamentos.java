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

    @PrePersist
    protected void onCreate() {
        this.dtPagamento = LocalDateTime.now();
    }

    public void setTxid(String txid) {    };

    // Converte os dados da Efí para atualizar sua entidade antes de salvar
    public void updateEntityWithPix(Pagamentos pagamento, PixResponseDTO pixDto) {
        if (pixDto == null) return;

        // Armazenamos o TXID para identificar o pagamento no Webhook depois
        pagamento.setTxid(pixDto.txid());

        // O status inicial de um Pix gerado na Efí é sempre 0 (Pendente)
        pagamento.setStatus(0);

        //*Imprementar->  salvar a string do QR Code ou Link se precisar de log
      //  pagamento.setObservacao("Pix gerado. TXID: " + pixDto.txid());
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