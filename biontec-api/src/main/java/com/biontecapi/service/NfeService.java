package com.biontecapi.service;

import com.biontecapi.model.Nfe;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


public interface NfeService {
    String processarNfe(Long idNfe, String usuario);
    String processarLote(Date dataRef, String usuario);
    List<Nfe> buscarPorStatus(String status);
    List<Nfe> nfesProcessadas(String status);
    BigDecimal calcularImposto(Long idNfe) ;
    String processarLoteAlternativo(Date dataRef, String usuario);

    }