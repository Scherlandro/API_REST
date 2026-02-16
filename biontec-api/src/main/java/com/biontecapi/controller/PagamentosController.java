package com.biontecapi.controller;

import com.biontecapi.dtos.PixEstornoDTO;
import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.security.EfiSecurityComponent;
import com.biontecapi.service.EfiService;
import com.biontecapi.service.PagamentosService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/api/pagamentos/")
public class PagamentosController {

    @Autowired
    private PagamentosService pagamentosService;

    @Autowired
    EfiSecurityComponent efiSecurity;

    @Autowired
    EfiService efiService;

    @PostMapping("efi/pix")
    public ResponseEntity<PixResponseDTO> gerarPix(@RequestBody PixRequestDTO dto) {
        return ResponseEntity.ok(pagamentosService.criarPix(dto));
    }

    @PostMapping("efi/webhook")
    public ResponseEntity<Void> receberWebhook(@RequestBody String payload, HttpServletRequest request) {
        // Chamada manual da validação de IP (Segurança por IP)
        if (!efiSecurity.isRequestFromEfi(request)) {
           log.warn("Tentativa de acesso não autorizada ao Webhook vinda do IP: {}", request.getRemoteAddr());
           // return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            return ResponseEntity.status(403).build();
        }
        // Processar o pagamento
        try {
            pagamentosService.processarRetornoEfi(payload);
            // Deve retornar 200 OK para a Efí parar de reenviar a notificação
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erro ao processar Webhook: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @PostMapping("efi/estornarPix")
    public ResponseEntity<Void> estornarPix(@RequestBody PixEstornoDTO estornoDto) {
            efiService.estornarPix( estornoDto.idPagamento(), estornoDto.valor() );
        return ResponseEntity.ok().build();
    }

}