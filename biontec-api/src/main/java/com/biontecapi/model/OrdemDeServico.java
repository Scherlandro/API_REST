package com.biontecapi.model;


import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordemDeServico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdemDeServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_os;
    private Integer idCliente;
    private String nomeCliente;
    private Integer idFuncionario;

    /*  @Temporal(TemporalType.DATE)
     private Date dataDeEntrada;*/
    private LocalDateTime dataDeEntrada;
    private LocalDateTime ultimaAtualizacao;
    private Status status;

    private Double subtotal;
    private Double desconto;
    private Double porConta;
    private Double total;
    private Double restante;

    private String descricaoObj;
    private String numeracao;
    private String cor;
    private String observacao;

 /*   @ManyToOne
    @JoinColumn(name = "cliente_id", referencedColumnName = "id_cliente")
    private Cliente cliente;
*/
    @ManyToOne
    @JoinColumn(name = "gestor_id", referencedColumnName = "id_funcionario")
    private Funcionario gestorDaOS;

    @ManyToOne
    @JoinColumn(name = "tecnico_encarregado_id", referencedColumnName = "id_funcionario")
    private Funcionario tecnicoEncarregado;

    @OneToMany(mappedBy = "ordemDeServico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItensDoServico> itensDoServicos;

     public OrdemDeServicoDTO toDTO() {
      return new OrdemDeServicoDTO(id_os,idCliente, nomeCliente,idFuncionario, dataDeEntrada,
          ultimaAtualizacao, status, subtotal, desconto, porConta, total, restante,
          descricaoObj, numeracao, cor, observacao,
           gestorDaOS, tecnicoEncarregado,itensDoServicos);
 }

}

