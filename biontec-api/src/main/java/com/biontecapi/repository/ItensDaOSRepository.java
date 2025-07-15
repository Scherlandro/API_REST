package com.biontecapi.repository;

import com.biontecapi.model.ItensDoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItensDaOSRepository extends JpaRepository<ItensDoServico,Long> {

}
