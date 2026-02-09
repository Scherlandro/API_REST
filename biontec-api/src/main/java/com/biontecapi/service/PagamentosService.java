package com.biontecapi.service;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.model.Pagamentos;

import java.time.LocalDate;
import java.util.List;

public interface PagamentosService {

     Pagamentos salvarPagamento(PagamentosDto dto);

     List<Pagamentos> listarPorOrigem(Integer id, String tipo);

     void cancelarPagamento(Integer idPagamento);

     List<FechamentoCaixaDto> gerarFechamento(LocalDate data);

}
