package com.biontecapi.serviceImpl;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.mapper.PagamentosMapper;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.EfiService;
import com.biontecapi.service.PagamentosService;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class PagamentosServiceImpl implements PagamentosService {

   final PagamentosRepository repository;
   final PagamentosMapper pagMapper;
   final EfiService efiService; // lida com o SDK da Efí

     public PagamentosServiceImpl(PagamentosRepository repository, PagamentosMapper mapper, EfiService efiService){
        this.repository = repository;
         this.pagMapper = mapper;
         this.efiService = efiService;
     }

    public Pagamentos salvarPagamento(PagamentosDto dto) {
        Pagamentos p = new Pagamentos();
        p.setValorPago(dto.valorPago());
        p.setFormaPagamento(dto.formaPagamento());
        p.setOrigemId(dto.origemId());
        p.setTipoOrigem(dto.tipoOrigem());
        p.setStatus(1); // 1 = Pago
        return repository.save(p);
    }

    @Override
    @Transactional
    public PixResponseDTO criarPix(PixRequestDTO dto) {
        // 1. Localiza o pagamento que já deve existir (ou cria um novo)
        Pagamentos pagamento = repository.findById(dto.idPagamento().intValue())
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));
        // 2. Chama o serviço da Efí
        PixResponseDTO efiResponse = efiService.gerarCobrancaPix(dto);
        // 3. Vincula o TXID à entidade para conferência futura
        pagamento.setTxid(efiResponse.txid());
        pagamento.setStatus(0); // Pendente
        repository.save(pagamento);

        return efiResponse;
    }

    @Transactional
    public void processarRetornoEfi(String payload) {
        JSONObject json = new JSONObject(payload);
        if (json.has("pix")) {
            var pagamentosPagos = json.getJSONArray("pix");
            for (int i = 0; i < pagamentosPagos.length(); i++) {
                String txid = pagamentosPagos.getJSONObject(i).getString("txid");
                repository.findByTxid(txid).ifPresent(p -> {
                    p.setStatus(1); // Pago
                    repository.save(p);
                });
            }
        }
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