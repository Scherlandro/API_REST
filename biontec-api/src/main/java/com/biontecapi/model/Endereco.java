package com.biontecapi.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name ="enderecos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {

    @Id
   // @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, length = 20)
    private String cep;

    @Column(nullable = false, length = 80)
    private String logradouro;

    @Column(nullable = false, length = 11)
    private String numero;

  /*  // Getter and Setter for 'number'
    public String getNumber() {
        return numero;
    }*/

    public void setNumero(String numero) {
        // Check if the input is a numeric value
        if (numero == null || !numero.matches("\\d+")) {
            this.numero = "0"; // Set to "0" if the input is not numeric
        } else {
            this.numero = numero; // Otherwise, set the provided value
        }
    }

    @Column(nullable = false, length = 50)
    private String bairro;

    @Column(nullable = false, length = 50)
    private String cidade;

    @Column(nullable = false, length = 50)
    private String estado;

    @OneToOne(fetch = FetchType.EAGER)
    private Pais pais = getPais();

}
