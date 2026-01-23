package com.biontecapi.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biontecapi.dtos.VendasDto;
import com.biontecapi.model.Vendas;
import com.biontecapi.service.VendasService;

@RestController
@RequestMapping(path = "/api/vendas")
public class VendasController {
    @Autowired
    private VendasService vendas_serv;
  
    @Autowired
    private ModelMapper mapper;

    @GetMapping(path = "/all")
    public ResponseEntity<List<VendasDto>> listarVendas() {
        List<Vendas> list = vendas_serv.listarVendas();
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, VendasDto.class)).collect(Collectors.toList()));
    }

    @GetMapping(path = "/{idVenda}")
    public ResponseEntity consultarPorCod(@PathVariable("idVenda") Integer idVenda) {
        Optional<Vendas> vendas = vendas_serv.litarVendaPorCod(idVenda);
        return ResponseEntity.ok(vendas.map(
                e -> mapper.map(e,VendasDto.class)).map(r->ResponseEntity.ok().body(r))
                .orElse(ResponseEntity.notFound().build()));
    }

    @GetMapping(path = "/buscarVdPorCliente")
    public ResponseEntity<List<VendasDto>> listarVendasPorCliente(@RequestParam(name ="nomeCliente") String nomeCliente) {
        List<Vendas> vendas = vendas_serv.litarVendaPorCliente(nomeCliente);
        return ResponseEntity.ok(vendas.stream().map(
                e -> mapper.map(e,VendasDto.class))
                .collect(Collectors.toList()));
    }


    @PostMapping(path = "/salvar")
    public ResponseEntity salvar(@RequestBody VendasDto vendasDto) {
        vendas_serv.save(mapper.map(vendasDto, Vendas.class));
        Optional<Vendas> vendas = vendas_serv.findById(vendasDto.getIdVenda());
        return ResponseEntity.ok(vendas.map(e -> mapper.map(e,
                VendasDto.class)).map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build()));
    }

   @PutMapping
    public ResponseEntity<Vendas> atualizarOS(@RequestBody VendasDto dto) {
           return ResponseEntity.ok(vendas_serv.save(dto));
    }

    @PutMapping(path = "/editar")
    public ResponseEntity editar(@RequestBody VendasDto vendasDto) {
        vendas_serv.save(mapper.map(vendasDto, Vendas.class));
        Optional<Vendas> vendas = vendas_serv.findById(vendasDto.getIdVenda());
        return ResponseEntity.ok(vendas.map(e -> mapper.map(e,
                VendasDto.class)).map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build()));
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity excluir(@PathVariable("id") Integer id) {
        vendas_serv.delete(id);
        return ResponseEntity.noContent().build();
    }




}