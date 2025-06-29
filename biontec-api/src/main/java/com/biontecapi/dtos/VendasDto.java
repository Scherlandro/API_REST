package com.biontecapi.dtos;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.biontecapi.model.ItensDaVenda;
import lombok.*;

import java.util.Collection;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VendasDto {

    private Integer idVenda;
    private Integer idCliente;
    @NotNull
    @NotBlank
    private String nomeCliente;
    private Integer idFuncionario;
    private String nomeFuncionario;
    private String dt_venda;
    private Double subtotal;
    private Double desconto;
    private Double totalgeral;
    private String formasDePagamento;
    @Size(max = 2)
    private Integer qtdDeParcelas;
    private Collection<ItensDaVenda> itensVd;

}
