package com.biontecapi.controller;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.biontecapi.dtos.ItenDaOSDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.service.OrdemDeServicoService;

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

    @GetMapping(path = "/all")
    public ResponseEntity<List<OrdemDeServicoDTO>> listarOrdemDeServicos(){
       List<OrdemDeServico> os = service.listarOS();
         return ResponseEntity.ok(os.stream().map(OrdemDeServico::toDTO).toList());
    }

    @GetMapping(path = "/{id_os}")
    public ResponseEntity findById(@PathVariable("id_os") Long idOS) {
        Optional<OrdemDeServico> serv = service.listarOSPorID(idOS);
        return ResponseEntity.ok(serv.map(
                e -> mapper.map(e, OrdemDeServicoDTO.class)).map(r -> ResponseEntity.ok().body(r))//ResponseEntity::ok
                .orElse(ResponseEntity.notFound().build()));
    }

  /*   @GetMapping("/{id}")
    public OrdemDeServicoDTO getOrdemDeServico(@PathVariable Long id) {
        Optional <OrdemDeServico> os = service.listarOSPorID(id);
        return os.get().toDTO();
    }*/

    @GetMapping("/cliente/{id_cliente}")
    public ResponseEntity<List<OrdemDeServico>> findOSPorIdClienteId(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(service.listarOSPorIdCliente(idCliente));
    }

    @GetMapping("/funcionario/{id_funcionario}")
    public ResponseEntity<List<OrdemDeServico>> findOSPorIdDoTecnico(@PathVariable Long IdTecnico) {
        return ResponseEntity.ok(service.listarOSPorIdDoTecnico(IdTecnico));
    }
/*    @PostMapping
    public void create(@RequestBody OrdemDeServicoDTO dto) {
        service.save(dto);
    }*/
    @PostMapping
    public ResponseEntity<OrdemDeServico> criarOS(@RequestBody OrdemDeServicoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarOS(dto));
    }

    @PutMapping("/{idOS}")
    public ResponseEntity<OrdemDeServico> atualizarOS(@PathVariable Long idOS, @RequestBody OrdemDeServicoDTO dto) {
        return ResponseEntity.ok(service.atualizarOS(idOS, dto));
    }

    @PostMapping("/{idOS}/items")
    public ResponseEntity<OrdemDeServico> adicionarItem(@PathVariable Long idOS, @RequestBody ItenDaOSDto itemDto) {
        return ResponseEntity.ok(service.addItemNaOS(idOS, itemDto));
    }

    @DeleteMapping("/{idOS}/items/{itemId}")
    public ResponseEntity<OrdemDeServico> removerItem(@PathVariable Long idOS, @PathVariable Long itemId) {
        return ResponseEntity.ok(service.removerItemDaOS(idOS, itemId));
    }

    @PostMapping("/{idOS}/concluirOS")
    public ResponseEntity<OrdemDeServico> cuncluirOS(@PathVariable Long idOS) {
        return ResponseEntity.ok(service.concluirOS(idOS));
    }

    @GetMapping("/variasBuscaOS")
    public ResponseEntity<List<OrdemDeServico>> variasBuscasOS(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer clientID,
            @RequestParam(required = false) Long technicianId,
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicioData,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fimData) {

        if (status != null) {
            return ResponseEntity.ok(service.listarOSPorStatus(status));
        }
        if (clientID != null) {
            return ResponseEntity.ok(service.listarOSPorIdCliente(clientID));
        }
        if (technicianId != null) {
            return ResponseEntity.ok(service.listarOSPorIdDoTecnico(technicianId));
        }
        if (placa != null) {
            return ResponseEntity.ok(service.listarOSPorIdDoTecnico(technicianId));
        }

        return ResponseEntity.ok(service.listarOS());
    }
}



