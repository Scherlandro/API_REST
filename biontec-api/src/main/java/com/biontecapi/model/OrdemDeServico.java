package com.biontecapi.model;

import com.biontecapi.Enum.Status;
import com.biontecapi.dtos.OrdemDeServicoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
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
    private Long idOS;

    private Integer idCliente;
    private String nomeCliente;
    private Integer idFuncionario;
    private String nomeFuncionario;

    private LocalDateTime dataDeEntrada;
    private LocalDateTime ultimaAtualizacao;

   // @Enumerated(EnumType.STRING)
    private Status status;

    private Double subtotal;
    private Double desconto;
    private Double porConta;
    private Double totalGeralOS;
    private Double restante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gestor_id")
    private Funcionario gestorDaOS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_encarregado_id")
    private Funcionario tecnicoEncarregado;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_os")
    private Collection<ItensDoServico> itensOS;

    public OrdemDeServicoDTO toDTO() {
        return new OrdemDeServicoDTO(
                idOS, idCliente, nomeCliente, idFuncionario,nomeFuncionario, dataDeEntrada,
                ultimaAtualizacao, status, subtotal, desconto, porConta, totalGeralOS, restante,
                    gestorDaOS, tecnicoEncarregado, toDTO().itensDoServicoDTO()
        );
    }

    /*

    public OrdemDeServicoDTO toDTO() {
        return new OrdemDeServicoDTO(
                idOS, idCliente, nomeCliente, idFuncionario, nomeFuncionario, dataDeEntrada,
                ultimaAtualizacao, status, subtotal, desconto, porConta, totalGeralOS, restante,
                gestorDaOS, tecnicoEncarregado, toDTOItensDoServico()
        );
    }

    private List<ItensDoServicoDTO> toDTOItensDoServico() {
        return itensOS.stream().map(ItensDoServico::toDTO).collect(Collectors.toList());
    }

     */
}