package com.biontecapi.model;

import javax.persistence.*;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "itensdavenda")
@AllArgsConstructor
@NoArgsConstructor
public class ItensDaVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_itens_vd", length = 20)
    private Integer IdItensVd;

    @Column(name = "codevendas", length = 20)
    private String codVenda;

    @Column(name = "cod_produtos",length = 20)
    private String codProduto;

    @Column(length = 60)
    private String descricao;

    @Column(name = "valor_compra")
    private Double valCompra;

    @Column(name = "valor_venda")
    private Double valVenda;

    @Column(name = "qtd_vendidas",length = 11)
    private Integer qtdVendidas;

    @Column(name = "valor_parcial")
    private Double valorParcial;

    @Transient
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dtRegistro;

    public ItensDaVendaDto toDTO(){
        return new ItensDaVendaDto(this.IdItensVd,this.codVenda,this.codProduto,this.descricao,
                this.valCompra, this.valVenda,this.qtdVendidas, this.valorParcial, this.dtRegistro);
    }

    public void mapToDTO(ItensDaVendaDto dto) {
                this.IdItensVd = dto.IdItensVd();
                this.codVenda = dto.codVenda();
                this.codProduto = dto.codProduto();
                this.descricao = dto.descricao();
                this.valCompra = dto.valCompra();
                this.valVenda = dto.valVenda();
                this.qtdVendidas = dto.qtdVendidas();
                this.valorParcial = dto.valorParcial();
                this.dtRegistro = dto.dtRegistro();
    }
}
