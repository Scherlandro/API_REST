package com.biontecapi.service;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.model.Pagamentos;

import java.time.LocalDate;
import java.util.List;

public interface PagamentosService {

     Pagamentos salvarPagamento(PagamentosDto dto);

     PixResponseDTO criarPix(PixRequestDTO dto) ;

     List<Pagamentos> listarPorOrigem(Integer id, String tipo);

     void cancelarPagamento(Integer idPagamento);

     List<FechamentoCaixaDto> gerarFechamento(LocalDate data);

     void processarRetornoEfi(String payload);
}
