package com.biontecapi.service;

import java.math.BigDecimal;
import java.util.Date;


public interface NfeService {
    String processarNfe(Long idNfe, String usuario);
    String processarLote(Date dataRef, String usuario);
    BigDecimal calcularImposto(Long idNfe) ;
    String processarLoteAlternativo(Date dataRef, String usuario);

    }