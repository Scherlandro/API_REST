package com.biontecapi.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItensDaVendaDto {

    private Integer id_itens_vd;
    private String codevendas;
    private String cod_produtos;
    private String descricao;
    private Double valor_compra;
    private Double valor_venda;
    private Integer qtd_vendidas;
    private Double valor_parcial;
    private String dt_venda;

}
