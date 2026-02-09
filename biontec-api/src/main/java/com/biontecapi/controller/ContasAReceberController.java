package com.biontecapi.controller;

import com.biontecapi.model.ContasAReceber;
import com.biontecapi.service.ContasAReceberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contas-receber")
@CrossOrigin("*")
public class ContasAReceberController {

    @Autowired
    private ContasAReceberService service;

    @GetMapping("/venda/{idVenda}")
    public ResponseEntity<List<ContasAReceber>> buscarPorVenda(@PathVariable Integer idVenda) {
        return ResponseEntity.ok(service.listarPorVenda(idVenda));
    }

    @PostMapping("/quitar")
    public ResponseEntity<Void> quitar(@RequestBody Map<String, Object> payload) {
        Integer idConta = (Integer) payload.get("idConta");
        String formaPgto = (String) payload.get("formaPagamento");

        service.quitarParcela(idConta, formaPgto);
        return ResponseEntity.ok().build();
    }
}
