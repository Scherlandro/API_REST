package com.biontecapi.controller;


import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.dtos.VendasDto;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.model.Vendas;
import com.biontecapi.service.OrdemDeServicoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/service-orders")
public class OrdemDeServicoController {

    private final OrdemDeServicoService service;
    @Autowired
    private ModelMapper mapper;

    public OrdemDeServicoController(OrdemDeServicoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OrdemDeServico>> findAll() {
        return ResponseEntity.ok(service.listarOS());
    }

    @GetMapping(path = "/{id_os}")
    public ResponseEntity findById(@PathVariable("id_os") Long idOS) {
        Optional<OrdemDeServico> serv = service.listarOSPorID(idOS);
        return ResponseEntity.ok(serv.map(
                e -> mapper.map(e, OrdemDeServicoDTO.class)).map(r -> ResponseEntity.ok().body(r))
                .orElse(ResponseEntity.notFound().build()));
    }

    @PostMapping
    public ResponseEntity<OrdemDeServico> create(@RequestBody OrdemDeServicoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createServiceOrder(dto));
    }

    @PutMapping("/{idOS}")
    public ResponseEntity<OrdemDeServico> update(@PathVariable Long idOS, @RequestBody OrdemDeServicoDTO dto) {
        return ResponseEntity.ok(service.updateServiceOrder(idOS, dto));
    }

    @GetMapping("/searchOS")
    public ResponseEntity<List<OrdemDeServico>> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String plate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        if (status != null) {
            return ResponseEntity.ok(service.listarOSPorStatus(status));
        }
        // other search conditions
        return ResponseEntity.ok(service.listarOS());
    }
}



