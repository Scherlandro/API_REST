package com.biontecapi.controller;

import com.biontecapi.dtos.PixRequestDTO;
import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.service.PagamentosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamentos/")
public class PagamentosController {

    @Autowired
    private PagamentosService pagamentosService;

    @PostMapping("efi/pix")
    public ResponseEntity<PixResponseDTO> gerarPix(@RequestBody PixRequestDTO dto) {
        return ResponseEntity.ok(pagamentosService.criarPix(dto));
    }

    @PostMapping("efi/webhook")
    public ResponseEntity<Void> receberWebhook(@RequestBody String payload) {
        // A Efí envia um JSON com informações do pagamento pago
        pagamentosService.processarRetornoEfi(payload);
        return ResponseEntity.ok().build();
    }
}