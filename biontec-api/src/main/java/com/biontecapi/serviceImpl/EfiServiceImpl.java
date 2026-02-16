package com.biontecapi.serviceImpl;


import br.com.efi.efisdk.EfiPay;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.EfiService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
    public class EfiServiceImpl implements EfiService {

    @Value("${efi.client-id}")
    private String clientId;

    @Value("${efi.client-secret}")
    private String clientSecret;

    @Value("${efi.certificate-path}")
    private String certificatePath;

    @Value("${efi.sandbox}")
    private boolean sandbox;

    @Value("${efi.chave-pix}")
    private String chavePix;

    private Map<String, Object> getOptions() {
        Map<String, Object> options = new HashMap<>();
        options.put("client_id", clientId);
        options.put("client_secret", clientSecret);
        options.put("certificate", certificatePath);
        options.put("sandbox", sandbox);
        return options;
    }
    @Autowired
    PagamentosRepository repository;

    public PixResponseDTO gerarCobrancaPix(PixRequestDTO dto) {
        Map<String, Object> options = getOptions();

        try {
            EfiPay efi = new EfiPay(options);

            // Corpo da cobrança usando os dados do DTO e das propriedades
            JSONObject body = new JSONObject()
                    .put("calendario", new JSONObject().put("expiracao", 3600))
                    .put("valor", new JSONObject().put("original", String.format("%.2f", dto.valor()).replace(",", ".")))
                    .put("chave", chavePix); // Chave vinda do properties

            JSONObject response = efi.call("pixCreateImmediateCharge", new HashMap<>(), body);

            /*
            return new PixResponseDTO(
                response.getJSONObject("loc").get("id").toString(),
                "link-copia-e-cola",
                response.getString("txid")
            );
             */
            // Extração dos dados de resposta
            String txid = response.getString("txid");
            String idLoc = response.getJSONObject("loc").get("id").toString();

            // Gerar o QR Code
            Map<String, String> params = new HashMap<>();
            params.put("id", idLoc);
            JSONObject qrCodeRes = efi.call("pixGenerateQRCode", params, new JSONObject());

            return new PixResponseDTO(
                    qrCodeRes.getString("imagemQrcode"),
                    qrCodeRes.getString("qrcode"),
                    txid
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro na integração Efí: " + e.getMessage());
        }
    }

    public void estornarPix(Integer idPagamento, Double valor) {
        // 1. Busca no SEU banco os dados que salvamos no Webhook
        Pagamentos p = repository.findById(idPagamento)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado no banco"));

        if (p.getE2eid() == null) {
            throw new RuntimeException("Este pagamento ainda não possui um e2eId (pode não ter sido confirmado)");
        }


        Map<String, Object> options = getOptions();
        try {
            EfiPay efi = new EfiPay(options);
            // Gerando um ID único para esta devolução (ex: dev-8f2a...)
            String idDevolucaoUnico = "dev-" + java.util.UUID.randomUUID().toString().substring(0, 12);

            // e2eid é o identificador fim-a-fim que a Efí envia no Webhook de pagamento
            Map<String, String> params = new HashMap<>();
            params.put("e2eId", p.getE2eid());
            params.put("id", idDevolucaoUnico); // Um ID que é gerado para identificar essa devolução

            JSONObject body = new JSONObject().put("valor", String.format("%.2f", valor).replace(",", "."));
            efi.call("pixDevolve", params, body);

            // Opcional: Já mudar o status para 2 aqui ou esperar o Webhook confirmar
            p.setStatus(2);
            repository.save(p);

            System.out.println("Estorno solicitado : " + body);
            //  log.info("Estorno solicitado: " + body.toString());

        } catch (Exception e) {
            throw new RuntimeException("Erro no estorno: " + e.getMessage());
        }
    }

}