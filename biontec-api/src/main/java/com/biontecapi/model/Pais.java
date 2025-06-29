package com.biontecapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "paises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pais {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, length = 45)
   private String nome_pais ;

    @Column(nullable = false, length = 49)
    private String  bandeira ;

    private Integer area;

    private Integer population;

    @Column(nullable = false, length = 173)
    private String description;

}
