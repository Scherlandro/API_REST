package com.biontecapi.model;

import com.biontecapi.dtos.ClienteDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "cliente")
@Data @NoArgsConstructor
@AllArgsConstructor
public class Cliente {

 @Id
 @GeneratedValue(strategy = GenerationType.SEQUENCE)
 private Integer id_cliente;

 @Column(nullable = false, name = "nome_cliente", length = 50)
 private String  nomeCliente;

 @Column(nullable = false, length = 50)
 private String inscricaoest;

 @Column(nullable = false, length = 15)
 private String pessoa;

 @Column(nullable = false, length = 25)
 private String cpf;

 @Column(nullable = false, length = 45)
 private String cnpj;

 @Column(nullable = false, length = 10)
 private Integer numero;

 //@ManyToOne(fetch = FetchType.EAGER)
 //private Collection<EnderecoModel> cep = new ArrayList<EnderecoModel>(getCep());
 @Column(nullable = false, length = 20)
 private String cep = new Endereco().getCep();

 @Column(nullable = false, length = 30)
 private String telefone;

 @Column(nullable = false, length = 30)
 private String celular;

 @Column(nullable = false, length = 30)
 private String zap;


 public ClienteDTO toDTO() {
  return new ClienteDTO(id_cliente, nomeCliente, inscricaoest, pessoa,
          cpf, cnpj, numero, cep, telefone, celular, zap);
 }


}