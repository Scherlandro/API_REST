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


        @Column(name = "cod_os")
        private Long codOS;

        @Column(name = "cod_produtos", length = 20)
        private String codProduto;

        @Column(length = 60)
        private String descricao;

        @Column(name = "valor_unitario", length = 20)
        private Double valorUnitario;

        @Column(name = "qtd", length = 5)
        private Integer quantidade;

        @Column(name = "total", length = 15)
        private Double total;

        // Método para calcular o total automaticamente
       /* @PrePersist
        @PreUpdate
        public void calcularTotal() {
            if (valorUnitario != null && quantidade != null) {
                this.total = valorUnitario * quantidade;
            }
        }*/

        public ItensDoServicoDTO toDTO(){
            return new ItensDoServicoDTO(idItensDaOS,codOS,
                    codProduto,descricao,valorUnitario,quantidade,total);
        }

    }