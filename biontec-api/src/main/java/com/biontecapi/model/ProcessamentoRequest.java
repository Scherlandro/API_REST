package com.biontecapi.model;

import java.util.Date;

public class ProcessamentoRequest {
    private Long idNfe;
    private String usuario;
    private Date dataReferencia;

    // Getters and Setters
    public Long getIdNfe() { return idNfe; }
    public void setIdNfe(Long idNfe) { this.idNfe = idNfe; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public Date getDataReferencia() { return dataReferencia; }
    public void setDataReferencia(Date dataReferencia) { this.dataReferencia = dataReferencia; }
}