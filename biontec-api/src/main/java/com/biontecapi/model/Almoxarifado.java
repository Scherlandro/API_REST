package com.biontecapi.model;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "Almoxarifado")
public class Almoxarifado implements Serializable {
    private static final long serialversionUID= 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id_store;
    @Column(nullable = false)
    private Boolean disponibilidade;
    @Column(nullable = false, length = 5)
    private String n_regional;
    @Column(nullable = false,unique = true, length = 10)
    private String placa;
    @Column(nullable = false, length = 50)
    private String nome_veiculo;
    @Column(nullable = false)
    private LocalDateTime dt_saida;
    @Column(nullable = false)
    private LocalDateTime dt_entrada;
    @Column(length = 10)
    private String tipo_carga_veicular;


    public Integer getId_store() {
        return id_store;
    }

    public void setId_store(Integer id_veiculo) {
        this.id_store = id_veiculo;
    }

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

    public LocalDateTime getDt_saida() {
        return dt_saida;
    }

    public void setDt_saida(LocalDateTime dt_saida) {
        this.dt_saida = dt_saida;
    }

    public LocalDateTime getDt_entrada() {
        return dt_entrada;
    }

    public void setDt_entrada(LocalDateTime dt_entrada) {
        this.dt_entrada = dt_entrada;
    }

    public Boolean getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(Boolean disponibilidade) {
        this.disponibilidade = disponibilidade;
    }
}
