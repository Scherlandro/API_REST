package com.biontecapi.service;

import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;

public interface EfiService {

    PixResponseDTO gerarCobrancaPix(PixRequestDTO dto);
}
