package com.biontecapi.model;

import com.biontecapi.dtos.ItensDoServicoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


    @Entity
    @Table(name = "itens_do_servico")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ItensDoServico {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_itens_os")
        private Long idItensDaOS;

        @ManyToOne
        @Transient
        private Produto prod;

        @Column(name = "cod_os", length = 20)
        private String codOS;
        @Column(name = "cod_produtos",length = 20)
        private String codProduto;
        @Column(length = 60)
        private String descricao;
        @Column(name = "valor_unitario",length = 20)
        private Double valorUnitario;
        @Column(name = "qtd", length = 5)
        private Integer quantidade;
        @Column(name = "total", length = 15)
        private Double total;

        @ManyToOne
        @JoinColumn(name = "ordem_de_servico_id")
        private OrdemDeServico ordemDeServico;

        public ItensDoServicoDTO toDTO(){
            return new ItensDoServicoDTO(idItensDaOS,codOS,prod,
                    codProduto,descricao,valorUnitario,quantidade,total);
        }


    }