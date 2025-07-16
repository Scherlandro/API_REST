package com.biontecapi.repository;

import com.biontecapi.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    @Query(value = "select c from Cliente c where trim(c.nomeCliente) like %?1%")
    List<Cliente> listarClientePorNome(@Param("nomeCliente")String nomeCliente);

}


