package com.biontecapi.controller;

import com.biontecapi.model.Nfe;
import com.biontecapi.model.ProcessamentoRequest;
import com.biontecapi.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/nfe")
@CrossOrigin(origins = "http://localhost:4200")
public class NfeController {

    @Autowired
    private NfeService nfeService;


    @PostMapping("/processar")
    public ResponseEntity<String> processarNfe(@RequestBody ProcessamentoRequest request) {

        try {
            String resultado = nfeService.processarNfe(request.getIdNfe(), request.getUsuario());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar NFe: " + e.getMessage());
        }
    }

    @PostMapping("/processar-lote")
    public ResponseEntity<String> processarLote(@RequestBody ProcessamentoRequest request) {

        try {
            // Validações
            if (request == null) {
                return ResponseEntity.badRequest().body("Request não pode ser nulo");
            }
            if (request.getDataReferencia() == null) {
                return ResponseEntity.badRequest().body("Data de referência é obrigatória");
            }
            if (request.getUsuario() == null || request.getUsuario().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Usuário é obrigatório");
            }

            String resultado = nfeService.processarLote(request.getDataReferencia(), request.getUsuario());
            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar lote: " + e.getMessage());
        }
        /*        try {
            if (request == null || request.getDataReferencia() == null ||
                    request.getUsuario() == null || request.getUsuario().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Dados de entrada inválidos");
            }
            String resultado = nfeService.processarLote(request.getDataReferencia(), request.getUsuario());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar lote: " + e.getMessage());
        }*/
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Nfe>> getNfesPendentes() {
        try {
            List<Nfe> nfesPendentes = nfeService.buscarPorStatus("PENDENTE");
            return ResponseEntity.ok(nfesPendentes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/processadas")
    public ResponseEntity<List<Nfe>> processarNfe() {
        try {
            List<Nfe> resultado = nfeService.nfesProcessadas("PROCESSADA");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/calcular-imposto/{idNfe}")
    public ResponseEntity<BigDecimal> calcularImposto(@PathVariable Long idNfe) {
        try {
            BigDecimal imposto = nfeService.calcularImposto(idNfe);
            return ResponseEntity.ok(imposto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}