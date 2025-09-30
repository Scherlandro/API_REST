package com.biontecapi.dtos;

import java.math.BigDecimal;
import java.util.Date;

public record NfeDTO(

          Long idNfe,
          Long numero,
          Long serie,
          Date dataEmissao,
          BigDecimal valorTotal,
          String emitente,
          String destinatario,
          String status,
          Date dataProcessamento,
          String usuarioProcessamento

) {
}
