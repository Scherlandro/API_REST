package com.biontecapi.repository;

import com.biontecapi.model.Cliente;
import com.biontecapi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    @Query(value = "select c from Cliente c where trim(c.nome_cliente) like %?1%")
    Optional<Cliente> listarClientePorNome(@Param("nome_cliente")String nome_cliente);

}


