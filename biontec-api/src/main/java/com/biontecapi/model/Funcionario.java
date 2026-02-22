package com.biontecapi.model;

import com.biontecapi.dtos.FuncionarioDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "funcionario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id_funcionario;

    @Column(nullable = false, name = "nome_funcionario", length = 50)
    private String nomeFuncionario;

    @Column(nullable = false, length = 15)
    private String rg;

    @Column(nullable = false, length = 15)
    private String cpf;

    @Column(nullable = false, length = 10)
    private String dt_nascimnento;

    @Column(nullable = false, length = 10)
    private String dt_admissao;

    @Column(nullable = false, length = 10)
    private String dt_demissao;

    @Column(length = 45)
    private String cargo;

    @Column(length = 10)
    private Double salario;

    @Column(length = 25)
    private String tipo_logradouro;

    @Column(length = 65)
    private String logradouro;

    @Column(length = 10)
    private Integer n_residencial;

    @Column(nullable = false, length = 10)
    private String complemento;

    @Column(nullable = false, length = 65)
    private String bairro;

    @Column(nullable = false, length = 65)
    private String cidade;

    @Column(nullable = false, length = 20)
    private String cep = new Endereco().getCep();

    @Column(nullable = false, length = 30)
    private String telefone;

    @Column(nullable = false, length = 30)
    private String celular;

    @Column(nullable = false, length = 30)
    private String zap;

    @Column(nullable = false, length = 65)
    private String email;

    @Column(length = 200)
    private String obs;

    public FuncionarioDTO toDTO() {
        return new FuncionarioDTO(id_funcionario, nomeFuncionario,rg, cpf,  dt_nascimnento,
                dt_admissao, dt_demissao, cargo,salario, tipo_logradouro,logradouro,
                n_residencial, complemento,bairro, cidade,telefone,celular,zap,email,obs);
    }

    public void mapToDTO(FuncionarioDTO dto) {
        if (dto == null) return;

        this.id_funcionario = dto.idFuncionario();
        this.nomeFuncionario = dto.nomeFuncionario();
        this.rg = dto.rg();
        this.cpf = dto.cpf();
        this.dt_nascimnento = dto.dtNascimnento();
        this.dt_admissao = dto.dtAdmissao();
        this.dt_demissao = dto.dtDemissao();
        this.cargo = dto.cargo();
        this.salario = dto.salario();
        this.tipo_logradouro = dto.tipo_logradouro();
        this.logradouro = dto.logradouro();
        this.n_residencial = dto.n_residencial();
        this.complemento = dto.complemento();
        this.bairro = dto.bairro();
        this.cidade = dto.cidade();
        this.telefone = dto.telefone();
        this.celular = dto.celular();
        this.zap = dto.zap();
        this.email = dto.email();
        this.obs = dto.obs();
    }
}
