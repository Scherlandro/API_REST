package com.biontecapi.serviceImpl;


import br.com.efi.efisdk.EfiPay;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.service.EfiService;
import org.json.JSONObject;
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

    public PixResponseDTO gerarCobrancaPix(PixRequestDTO dto) {
        Map<String, Object> options = new HashMap<>();
        options.put("client_id", clientId);
        options.put("client_secret", clientSecret);
        options.put("certificate", certificatePath);
        options.put("sandbox", sandbox);

        try {
            EfiPay efi = new EfiPay(options);

            // Corpo da cobrança usando os dados do DTO e das propriedades
            JSONObject body = new JSONObject()
                    .put("calendario", new JSONObject().put("expiracao", 3600))
                    .put("valor", new JSONObject().put("original", String.format("%.2f", dto.valor()).replace(",", ".")))
                    .put("chave", chavePix); // Chave vinda do properties

            JSONObject response = efi.call("pixCreateImmediateCharge", new HashMap<>(), body);

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
}