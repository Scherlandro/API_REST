package com.biontecapi.repository;
import com.biontecapi.model.Nfe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NfeRepository extends JpaRepository<Nfe, Long> {
    List<Nfe> findByStatus(String status);
    List<Nfe> findByDataEmissaoAndStatus(Date dataEmissao, String status);
}