package com.biontecapi.model;


import com.biontecapi.dtos.NfeDTO;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "nfe_notas_fiscais")
public class Nfe {
    @Id
    @Column(name = "id_nfe")
    private Long idNfe;

    private Long numero;
    private Long serie;

    @Column(name = "data_emissao")
    @Temporal(TemporalType.DATE)
    private Date dataEmissao;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    private String emitente;
    private String destinatario;
    private String status;

    @Column(name = "data_processamento")
    @Temporal(TemporalType.DATE)
    private Date dataProcessamento;

    @Column(name = "usuario_processamento")
    private String usuarioProcessamento;

    // Getters and Setters
    public Long getIdNfe() { return idNfe; }
    public void setIdNfe(Long idNfe) { this.idNfe = idNfe; }

    public Long getNumero() { return numero; }
    public void setNumero(Long numero) { this.numero = numero; }

    public Long getSerie() { return serie; }
    public void setSerie(Long serie) { this.serie = serie; }

    public Date getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(Date dataEmissao) { this.dataEmissao = dataEmissao; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public String getEmitente() { return emitente; }
    public void setEmitente(String emitente) { this.emitente = emitente; }

    public String getDestinatario() { return destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getDataProcessamento() { return dataProcessamento; }
    public void setDataProcessamento(Date dataProcessamento) { this.dataProcessamento = dataProcessamento; }

    public String getUsuarioProcessamento() { return usuarioProcessamento; }
    public void setUsuarioProcessamento(String usuarioProcessamento) { this.usuarioProcessamento = usuarioProcessamento; }

    public NfeDTO toDTO() {
        return new NfeDTO(idNfe, numero, serie, dataEmissao, valorTotal,
                emitente, destinatario, status, dataProcessamento, usuarioProcessamento);
    }

}
