package com.biontecapi.serviceImpl;


import com.biontecapi.model.Nfe;
import com.biontecapi.repository.NfeRepository;
import com.biontecapi.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Types;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NfeServiceImpl implements NfeService {

    @Autowired
    private NfeRepository nfeRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public String processarNfe(Long idNfe, String usuario) {
        try {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("processar_nfe");

            SqlParameterSource params = new MapSqlParameterSource()
                    .addValue("p_id_nfe", idNfe)
                    .addValue("p_usuario", usuario);

            Map<String, Object> result = jdbcCall.execute(params);
            return "SUCESSO"; // MySQL não retorna OUT parameters da mesma forma que Oracle

        } catch (Exception e) {
            return "ERRO: " + e.getMessage();
        }
    }
    /*
         **** Para BD ORACLE ***
    public String processarNfe(Long idNfe, String usuario) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("pkg_nfe")
                .withProcedureName("processar_nfe")
                .declareParameters(
                        new SqlParameter("p_id_nfe", Types.NUMERIC),
                        new SqlParameter("p_usuario", Types.VARCHAR),
                        new SqlOutParameter("p_resultado", Types.VARCHAR)
                );

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_nfe", idNfe);
        params.put("p_usuario", usuario);

        Map<String, Object> result = jdbcCall.execute(params);
        return (String) result.get("p_resultado");
    }*/

    @Override
    public String processarLote(Date dataRef, String usuario) {
        try {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("processar_lote");

            SqlParameterSource params = new MapSqlParameterSource()
                    .addValue("p_data_ref", dataRef)
                    .addValue("p_usuario", usuario);

            Map<String, Object> result = jdbcCall.execute(params);
            return "Lote processado com sucesso";

        } catch (Exception e) {
            return "ERRO: " + e.getMessage();
        }
    }


  /*  public String processarLote(Date dataRef, String usuario) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withCatalogName("pkg_nfe")
                .withProcedureName("processar_lote")
                .declareParameters(
                        new SqlParameter("p_data_ref", Types.DATE),
                        new SqlParameter("p_usuario", Types.VARCHAR),
                        new SqlOutParameter("p_resultado", Types.VARCHAR)
                );

        Map<String, Object> params = new HashMap<>();
        params.put("p_data_ref", dataRef);
        params.put("p_usuario", usuario);

        Map<String, Object> result = jdbcCall.execute(params);
        return (String) result.get("p_resultado");
    }*/

    @Override
    public List<Nfe> buscarPorStatus(String status) {
        return nfeRepository.findByStatus(status);
    }

    @Override
    public List<Nfe> nfesProcessadas(String status) {
        return nfeRepository.findByStatus(status);

    }

    @Override
    public BigDecimal calcularAliquota(Long idNfe) {
        return nfeRepository.calcularAliquota(idNfe);
    }

    @Override
    public BigDecimal calcularImposto(Long idNfe) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT calcular_imposto(?)",
                    BigDecimal.class,
                    idNfe
            );
        } catch (Exception e) {
            return BigDecimal.valueOf(-1);
        }
    }
   /* public BigDecimal calcularImposto(Long idNfe) {
        return jdbcTemplate.queryForObject(
                "SELECT pkg_nfe.calcular_imposto(?) FROM dual",
                BigDecimal.class,
                idNfe
        );
    }*/

    // Método alternativo usando CALL diretamente
    @Override
    public String processarLoteAlternativo(Date dataRef, String usuario) {
        try {
            jdbcTemplate.execute("CALL processar_lote('" +
                    new java.sql.Date(dataRef.getTime()) + "', '" + usuario + "', @resultado)");

            String resultado = jdbcTemplate.queryForObject(
                    "SELECT @resultado", String.class);

            return resultado;
        } catch (Exception e) {
            return "ERRO: " + e.getMessage();
        }
    }

}