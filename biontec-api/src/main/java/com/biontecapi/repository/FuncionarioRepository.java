package com.biontecapi.repository;

import com.biontecapi.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario,Integer> {
/*
    List<Funcionario> findByFirstName(String firstName);
    @Query(
            "SELECT e FROM Funcionario e " +
                    "WHERE lower(e.nome_funcionario) LIKE lower(concat('%', :name, '%')) " +
                    "AND e.salario > :salario " +
                    "ORDER BY e.salario DESC"
    )
    List<Funcionario> findByNameLikeAndSalaryAbove(
            @Param("nome_funcionario") String name, @Param("salario") BigDecimal salario);
*/
}
