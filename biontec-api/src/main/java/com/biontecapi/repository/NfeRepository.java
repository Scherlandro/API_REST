package com.biontecapi.repository;
import com.biontecapi.model.Nfe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface NfeRepository extends JpaRepository<Nfe, Long> {
    List<Nfe> findByStatus(String status);
    //SELECT * FROM nfe_log_processamento;

    @Query(value =  "select alq.aliquota, nf.valor_total,alq.uf_origem , alq.uf_destino " +
            "FROM nfe_aliquotas_icms alq INNER JOIN nfe_notas_fiscais nf " +
            " WHERE  alq.uf_destino ='AL' and nf.id_nfe = ?1 ")
    BigDecimal calcularAliquota(@Param("id_nfe")Long id_infe);

    List<Nfe> findByDataEmissaoAndStatus(Date dataEmissao, String status);

}