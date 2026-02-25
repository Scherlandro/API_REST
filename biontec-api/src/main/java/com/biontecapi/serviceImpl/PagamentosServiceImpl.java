package com.biontecapi.serviceImpl;

import br.com.efi.efisdk.EfiPay;
import br.com.efi.efisdk.exceptions.EfiPayException;
import com.biontecapi.dtos.FechamentoCaixaDto;
import com.biontecapi.dtos.PagamentosDto;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.mapper.PagamentosMapper;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.PagamentosService;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PagamentosServiceImpl implements PagamentosService {

   final PagamentosRepository repository;
   final PagamentosMapper pagMapper;
    //  final EfiService efiService; // Aquele que lida com o SDK da Efí

     public PagamentosServiceImpl(PagamentosRepository repository,PagamentosMapper mapper){
        this.repository = repository;
         this.pagMapper = mapper;
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

    @Transactional
    public PixResponseDTO criarPix(PixRequestDTO dto) {
        // 1. Busca o pagamento pendente no seu banco
        Pagamentos pagamento = repository.findById(dto.idPagamento())
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        // 2. Chama a integração com a Efí Bank
        PixResponseDTO efiResponse = efiService.criarPix(dto);

        // 3. Usa o Mapper para atualizar a entidade com o TXID gerado pela Efí
        pagMapper.updateEntityWithPix(pagamento, efiResponse);

        // 4. Salva no banco de dados
        repository.save(pagamento);

        return efiResponse;
    }


    @Override
    public PixResponseDTO criarPix(PixRequestDTO dto) {
        // Configurações da Efí (Idealmente viriam de um @Configuration ou application.yml)
        Map<String, Object> options = new HashMap<>();
        options.put("client_id", "SEU_CLIENT_ID");
        options.put("client_secret", "SEU_CLIENT_SECRET");
        options.put("certificate", "caminho/do/seu/certificado.p12");
        options.put("sandbox", true);

        try {
            EfiPay efi = new EfiPay(options);

            // 1. Criar a cobrança imediata
            JSONObject body = new JSONObject()
                    .put("calendario", new JSONObject().put("expiracao", 3600))
                    .put("valor", new JSONObject().put("original", String.format("%.2f", dto.valor()).replace(",", ".")))
                    .put("chave", "SUA_CHAVE_PIX_EFÍ")
                    .put("infoAdicionais", new JSONObject().append("nome", "Pagamento").append("valor", dto.idPagamento().toString()));

            JSONObject response = efi.call("pixCreateImmediateCharge", new HashMap<>(), body);
            String idLoc = response.getJSONObject("loc").get("id").toString();

            // 2. Gerar o QR Code baseado no ID da locação
            Map<String, String> params = new HashMap<>();
            params.put("id", idLoc);
            JSONObject qrCodeRes = efi.call("pixGenerateQRCode", params, new JSONObject());

            return new PixResponseDTO(
                    qrCodeRes.getString("imagemQrcode"),
                    qrCodeRes.getString("qrcode"),
                    response.getString("txid")
            );

        } catch (EfiPayException e) {
            throw new RuntimeException("Erro Efí: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erro interno ao gerar Pix");
        }
    }

    @Transactional
    public void processarRetornoEfi(String payload) {
        JSONObject json = new JSONObject(payload);
        // A Efí costuma enviar um array "pix" com os pagamentos confirmados
        if (json.has("pix")) {
            var pagamentosPagos = json.getJSONArray("pix");
            for (int i = 0; i < pagamentosPagos.length(); i++) {
                String txid = pagamentosPagos.getJSONObject(i).getString("txid");

                // Aqui você busca no seu Repository o pagamento com esse TXID
                // Localiza o pagamento pelo TXID que salvamos na criação
                repository.findByTxid(txid).ifPresent(p -> {
                    p.setStatus(1); // 1 = Pago/Confirmado
                    repository.save(p);
                    System.out.println("Pagamento " + p.getId() + " confirmado via Pix!");
                });
                // altera o status para CONFIRMADO (Status 1 no seu código Angular)
                atualizarStatusPagamento(txid, 1);
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