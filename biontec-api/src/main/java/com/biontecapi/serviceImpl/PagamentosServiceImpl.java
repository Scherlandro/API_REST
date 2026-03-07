package com.biontecapi.serviceImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.ansi.AnsiOutput;
import org.springframework.stereotype.Service;

import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.EfiService;
import com.biontecapi.service.PagamentosService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PagamentosServiceImpl implements PagamentosService {

   final PagamentosRepository repository;
   final EfiService efiService; // lida com o SDK da Efí

     public PagamentosServiceImpl(PagamentosRepository repository, EfiService efiService){
        this.repository = repository;
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
        System.out.println( AnsiOutput.toString( AnsiColor.YELLOW, "DTO do pagamento -> "+ dto, AnsiColor.DEFAULT  ));

        Integer id = Optional.ofNullable(dto.idPagamento())
                .map(Long::intValue)
                .orElseThrow(() -> new RuntimeException("idPagamento obrigatório"));
        // 1. Localiza o pagamento que já deve existir (ou cria um novo)
        Pagamentos pagamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));
        // 2. Chama o serviço da Efí
        PixResponseDTO efiResponse = efiService.gerarCobrancaPix(dto);
        // 3. Vincula o TXID à entidade para conferência futura
        pagamento.setTxid(efiResponse.txid());
        pagamento.setStatus(0); // Pendente
        repository.save(pagamento);

        return efiResponse;
    }


    @Override
    @Transactional
    public void processarRetornoEfi(String payload) {
        log.info("Webhook recebido: {}", payload); // Imprime o JSON inteiro no log

        JSONObject json = new JSONObject(payload);

        if (json.has("pix")) {
            JSONArray pagamentosConfirmados = json.getJSONArray("pix");

            for (int i = 0; i < pagamentosConfirmados.length(); i++) {
                JSONObject pix = pagamentosConfirmados.getJSONObject(i);
                String txid = pix.getString("txid");
                String e2eIdEfí = pix.getString("endToEndId"); // Captura o ID da transação real

                repository.findByTxid(txid).ifPresent(p -> {
                    log.debug("Localizado Pagamento ID: {} para o TXID: {}", p.getIdPagamento(), txid);
                    // SEMPRE salvamos o e2eid se ele chegar, pois precisaremos dele para estornos futuros
                    p.setE2eid(e2eIdEfí);

                    // Prioridade 1: Verificar se há devoluções (Estorno)
                    if (pix.has("devolucoes")) {
                        JSONArray devolucoes = pix.getJSONArray("devolucoes");
                        for (int j = 0; j < devolucoes.length(); j++) {
                            if (devolucoes.getJSONObject(j).getString("status").equals("CONCLUIDA")) {
                                p.setStatus(2); // Estornado
                                repository.save(p);
                                log.info("Status do Pagamento {} atualizado para {}", p.getIdPagamento(), p.getStatus());
                                return; // Encerra o processamento deste Pix específico
                            }
                        }
                    }

                    // Prioridade 2: Se não foi estornado, marcar como Pago
                    if (p.getStatus() != 1) {
                        p.setStatus(1);
                        p.setDtPagamento(OffsetDateTime.now());
                        repository.save(p);
                        System.out.println("Pagamento TXID " + txid + " confirmado e salvo.");
                    }
                });
            }
        }

        // 3. Verificação de status de cobrança (Caso se configure o webhook para alteração de status)
        if (json.has("evp")) { // Chave de evento de status
            // Lógica para capturar se a cobrança expirou ou foi removida
            // Status como "REMOVIDA_PELO_USUARIO_RECEBEDOR" ou "EXPIRADA"
        }
    }

    @Override
    public Pagamentos salvarPagamentoCartao(PagamentosDto dto) {
        System.out.println( AnsiOutput.toString( AnsiColor.YELLOW, "DTO do pagamento em Crédito -> "+ dto, AnsiColor.DEFAULT  ));
        // 1. Regra do cartão: Pagamento mínimo de R$ 1,00
        if (dto.valorPago() < 1.0) {
            throw new RuntimeException("Valor insuficiente para processar.");
        }
        Pagamentos pagamento = new Pagamentos();
        pagamento.setValorPago(dto.valorPago());
        pagamento.setStatus(1); // Simulação de aprovação
        pagamento.setDtPagamento(OffsetDateTime.now());
        return repository.save(pagamento);
    }

public List<PagamentosDto> listarPorOrigem(Integer id, String tipo) {
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
    public List<FechamentoCaixaDto> gerarFechamento(OffsetDateTime data) {
        // Define o início do dia (00:00:00) mantendo o mesmo offset
        OffsetDateTime inicio = data.with(LocalTime.MIN);

        // Define o fim do dia (23:59:59.999...) mantendo o mesmo offset
        OffsetDateTime fim = data.with(LocalTime.MAX);

        return repository.resumoFechamento(inicio, fim);
    }

}