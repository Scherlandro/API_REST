package com.biontecapi.controller;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.mapper.OrdemDeServicoMapper;
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
    private final OrdemDeServicoMapper mapper;

    public OrdemDeServicoController(OrdemDeServicoService service,  OrdemDeServicoMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping(path = "/all")
    public ResponseEntity<List<OrdemDeServicoDTO>> listarOrdemDeServicos(){
       List<OrdemDeServico> list = service.listarOS();
         return ResponseEntity.ok(list.stream().map(OrdemDeServico::toDTO).toList());
    }

    @GetMapping(path = "/findOSById/{idOs}")
    public ResponseEntity<OrdemDeServicoDTO> findById(@PathVariable("idOs") Long idOS) {
        Optional<OrdemDeServico> serv = service.listarOSPorID(idOS);
        if (!serv.isPresent()) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não encontrar
        }
        OrdemDeServicoDTO ordemDeServicoDTO = serv.get().toDTO();
        return ResponseEntity.ok(ordemDeServicoDTO);
    }

    @GetMapping("/cliente/{id_cliente}")
    public ResponseEntity<List<OrdemDeServico>> findOSPorIdClienteId(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(service.listarOSPorIdCliente(idCliente));
    }

    @GetMapping("/funcionario/{id_funcionario}")
    public ResponseEntity<List<OrdemDeServico>> findOSPorIdDoTecnico(@PathVariable Long IdTecnico) {
        return ResponseEntity.ok(service.listarOSPorIdDoTecnico(IdTecnico));
    }

    @PostMapping
    public ResponseEntity<OrdemDeServico> criarOS(@RequestBody OrdemDeServicoDTO dto) {
         return ResponseEntity.status(HttpStatus.CREATED).body(service.criarOS(dto));
    }

    @PutMapping
    public ResponseEntity<OrdemDeServico> atualizarOS(@RequestBody OrdemDeServicoDTO dto) {
           return ResponseEntity.ok(service.atualizarOS(dto));
    }

   @PatchMapping("/{id}/total")
    public ResponseEntity<Void> atualizarTotal( @PathVariable Long id, @RequestBody Double total) {
        OrdemDeServico os = service.findById(id)
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));
        os.setTotalGeralOS(total);
        service.atualizarOS(os.toDTO());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{idOS}/items")
    public ResponseEntity<OrdemDeServico> adicionarItem(@PathVariable Long idOS, @RequestBody ItensDoServicoDTO itemDto) {
        return ResponseEntity.ok(service.addItemNaOS(idOS, itemDto));
    }

    @DeleteMapping("/{idOS}/items/{itemId}")
    public ResponseEntity<OrdemDeServico> removerItem(@PathVariable Long idOS, @PathVariable Long itemId) {
        return ResponseEntity.ok(service.removerItemDaOS(idOS, itemId));
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

     @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity excluir(@PathVariable("id") Long id) {
         service.removerOS(id);
        return ResponseEntity.noContent().build();
    }

}



