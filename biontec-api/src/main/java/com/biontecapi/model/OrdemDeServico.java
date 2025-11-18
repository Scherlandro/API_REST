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
@Table(name = "ordem_de_servico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdemDeServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_os")
    private Long idOs;

    private Integer idCliente;
    private String nomeCliente;
    private Integer idFuncionario;

    private LocalDateTime dataDeEntrada;
    private LocalDateTime ultimaAtualizacao;

   // @Enumerated(EnumType.STRING)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gestor_id")
    private Funcionario gestorDaOS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_encarregado_id")
    private Funcionario tecnicoEncarregado;

    @OneToMany(mappedBy = "ordemDeServico", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItensDoServico> itensDoServico = new ArrayList<>();

    // Métodos auxiliares para sincronização bidirecional
  /*  public void adicionarItem(ItensDoServico item) {
        itensDoServico.add(item);
        item.setOrdemDeServico(this);
    }
    public void removerItem(ItensDoServico item) {
        itensDoServico.remove(item);
        item.setOrdemDeServico(null);
    }*/

    public OrdemDeServicoDTO toDTO() {
        return new OrdemDeServicoDTO(
                idOs, idCliente, nomeCliente, idFuncionario, dataDeEntrada,
                ultimaAtualizacao, status, subtotal, desconto, porConta, total, restante,
                descricaoObj, numeracao, cor, observacao,
                gestorDaOS, tecnicoEncarregado, itensDoServico
        );
    }
}