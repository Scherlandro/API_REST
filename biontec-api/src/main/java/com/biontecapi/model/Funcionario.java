package com.biontecapi.model;

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

    @Column(nullable = false, length = 50)
    private String nome_funcionario;

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
    private String cargo ;

    @Column( length = 10)
    private Double salario;

    @Column(length = 25)
    private String tipo_logradouro;

    @Column( length = 65)
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

    @Column( length = 200)
    private String obs ;


}
