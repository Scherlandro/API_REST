package com.biontecapi.model;


import com.biontecapi.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordemDeServico")
@Data
/*@NoArgsConstructor*/
@AllArgsConstructor
public class OrdemDeServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_os;

    @ManyToOne
    @Transient
    private Cliente cliente;

    @ManyToOne
    @Transient
    private Funcionario funcionario;

    private Integer idCliente;
    private String nomeCliente;
    private Integer idFuncionario;
    private String gestorDaOS;
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


    @OneToMany(mappedBy = "ordemDeServico", cascade = CascadeType.ALL)
    private List<SubServicos> subservicos;

    public OrdemDeServico() {
        subservicos = new ArrayList<>();
    }

}

