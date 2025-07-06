package com.biontecapi.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biontecapi.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario,Integer> {

    List<Funcionario> findByFirstName(String firstName);

    @Query("SELECT f FROM funcionario f WHERE LOWER(TRIM(f.nome_funcionario)) LIKE LOWER(CONCAT('%', TRIM(':name'), '%')) "+
    " AND f.salario > :salario ORDER BY f.salario DESC, f.nome_funcionario ASC")
    List<Funcionario> findBySalaryOrderBySalario(@Param("nome_funcionario") String name, @Param("salario") BigDecimal salario);

@Query("SELECT e FROM Funcionario e WHERE lower(e.nome_funcionario) LIKE lower(concat('%', :name, '%')) AND e.salario > :salario ORDER BY e.nome_funcionario ASC")
List<Funcionario> findBySalaryOrderByName(String name, BigDecimal salario);

// SELECT * FROM funcionario WHERE LOWER(TRIM(nome_funcionario)) LIKE LOWER(CONCAT('%', TRIM('Sc'), '%')) AND salario > 1300 ORDER BY salario DESC, nome_funcionario ASC;


}