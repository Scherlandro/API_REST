package com.biontecapi.dtos;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class AlmoxarifadoDto {

    @NotBlank
    private String n_regional;
    @NotBlank
    @Size(max = 10)
    private String placa;
    @NotBlank
    private String tipo_carga_veicular;
    @NotBlank
    private String nome_veiculo;
    @NotNull
    private Boolean disponibilidade;

    public String getN_regional() {
        return n_regional;
    }

    public void setN_regional(String n_regional) {
        this.n_regional = n_regional;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getTipo_carga_veicular() {
        return tipo_carga_veicular;
    }

    public void setTipo_carga_veicular(String tipo_carga_veicular) {
        this.tipo_carga_veicular = tipo_carga_veicular;
    }

    public String getNome_veiculo() {
        return nome_veiculo;
    }

    public void setNome_veiculo(String nome_veiculo) {
        this.nome_veiculo = nome_veiculo;
    }

    public Boolean getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(Boolean disponibilidade) {
        this.disponibilidade = disponibilidade;
    }
}
