package com.biontecapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


    @Entity
    @Table(name = "subservicos")
    @Data
    /*@NoArgsConstructor*/
    @AllArgsConstructor
    public class SubServicos {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_subservicos;

      /*  @ManyToOne
        private SubServicos subservicos;*/

       /* @ManyToOne
        @Transient
        private Funcionario tecnicoEncarregado;*/


        private String tecnicoDaOs;

        private String descricaoObj;
        private String numeracao;
        private String cor;
        private String observacao;
        private Double subtotal;

        @OneToMany(mappedBy = "subservicos", cascade = CascadeType.ALL)
        private List<ItensDoServico> itensDoServicos;

        public SubServicos(){
            itensDoServicos = new ArrayList<>();
        }

       @ManyToOne
        @JoinColumn(name = "id_os")
        private OrdemDeServico ordemDeServico;

    }

