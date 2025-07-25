package com.biontecapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


    @Entity
    @Table(name = "itensDoServico")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ItensDoServico {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idItensDaOS;


        @ManyToOne
        @Transient
        private Produto prod;

        private Double precoDeVenda;
        private Integer quantidade;
        private Double total;
        private String serviceType;

        @ManyToOne
        @JoinColumn(name = "ordem_de_servico_id")
        private OrdemDeServico ordemDeServico;



    }