package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.PagamentosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class PagamentosServiceImpl implements PagamentosService {
    @Autowired
    private PagamentosRepository repository;

    public Pagamentos salvarPagamento(PagamentosDto dto) {
        Pagamentos p = new Pagamentos();
        p.setValorPago(dto.valorPago());
        p.setFormaPagamento(dto.formaPagamento());
        p.setOrigemId(dto.origemId());
        p.setTipoOrigem(dto.tipoOrigem());
        p.setStatus(1); // 1 = Pago
        return repository.save(p);
    }

    public List<Pagamentos> listarPorOrigem(Integer id, String tipo) {
        return repository.findByOrigemIdAndTipoOrigem(id, tipo);
    }

    @Override
    @Transactional
    public void cancelarPagamento(Integer idPagamento) {
        Pagamentos pg = repository.findById(idPagamento)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        // Status 2 = Cancelado/Estornado
        pg.setStatus(2);
        repository.save(pg);

        // Criar disparo para um evento notificar o módulo de origem
        // ex: se(pg.getTipoOrigem().equals("VENDA")) { ... }
    }

    @Override
    public List<FechamentoCaixaDto> gerarFechamento(LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.atTime(LocalTime.MAX);
        return repository.resumoFechamento(inicio, fim);
    }

}