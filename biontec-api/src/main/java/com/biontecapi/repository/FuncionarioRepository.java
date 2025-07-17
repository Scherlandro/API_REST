package com.biontecapi.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biontecapi.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {

    @Query(value = "select f from Funcionario f where trim(f.nomeFuncionario) like ?1%")
    List<Funcionario> listarFuncionarioPorNome(@Param("nomeFuncionario")String nomeFuncionario);


    @Query("SELECT f FROM Funcionario f WHERE LOWER(TRIM(f.nomeFuncionario)) LIKE LOWER(CONCAT('%', TRIM(':name'), '%')) " +
            " AND f.salario > :amount ORDER BY f.salario DESC, f.nomeFuncionario ASC")
    List<Funcionario> buscarPorValorSalarial(@Param("name") String name, @Param("amount") BigDecimal salario);

    @Query("SELECT e FROM Funcionario e WHERE lower(e.nomeFuncionario) LIKE lower(concat('%',:name,'%')) AND e.salario > :salario ORDER BY e.nomeFuncionario ASC")
    List<Funcionario> listarSalarioPorFuncionario(String name, BigDecimal salario);

}