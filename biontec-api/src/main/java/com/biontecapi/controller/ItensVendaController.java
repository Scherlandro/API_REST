package com.biontecapi.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.service.ItensDaVendaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/itensDaVenda")
public class ItensVendaController {

    @Autowired
    private ItensDaVendaService itensDaVendaService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<ItensDaVendaDto>> listarItensDaVenda() {
        List<ItensDaVenda> list = itensDaVendaService.findAll();
        return ResponseEntity.ok(list.stream().map(
               ItensDaVenda::toDTO).toList());
    }

    @GetMapping(value = "/buscarPorCliente")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorCliente(@RequestParam(name = "nome") String nome) {
        List<ItensDaVenda> list = itensDaVendaService.litarItemDaVendaPorCliente(nome);
        return ResponseEntity.ok(list.stream().map(
                ItensDaVenda::toDTO).toList());
    }

    @GetMapping(value = "/buscarPorIdProduct")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorIdProd(@RequestParam(value = "id") Integer id) {
        List<ItensDaVenda> list = itensDaVendaService.listarItensVdPorIdProduto(id);
        return ResponseEntity.ok(list.stream().map(
                ItensDaVenda::toDTO).toList());
    }

    @GetMapping(value = "/buscarPorIdVd")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorIdVd(@RequestParam(value = "id") Integer id) {
        List<ItensDaVenda> list = itensDaVendaService.listarItensDaVdPorId(id);
        return ResponseEntity.ok(list.stream().map(
                ItensDaVenda::toDTO).toList());
    }

    @GetMapping(value = "/buscarPorData")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorData(@RequestParam(name = "data") String data) {
        List<ItensDaVenda> list = itensDaVendaService.litarItemDaVendaPorData(data);
        return ResponseEntity.ok(list.stream().map(
                ItensDaVenda::toDTO).toList());
    }

    @GetMapping(value = "/ItensVdEntreDatas")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdEntreDatas(
            @RequestParam(name = "dtIni") LocalDateTime dtIni, @RequestParam(name = "dtFinal") LocalDateTime dtFinal) {
        List<ItensDaVenda> list = itensDaVendaService.ConsultarItensVdEntreDatas(dtIni, dtFinal);
      /*  if(!list.isEmpty()){
            return ResponseEntity.notFound().eTag("Não encontrado").build();
            //   return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else */
        return ResponseEntity.status(HttpStatus.FOUND).body(list.stream().map(
                ItensDaVenda::toDTO).toList());
    }

    
    @PostMapping(path = "/salvar")
    public ResponseEntity salvar(@RequestBody ItensDaVendaDto dto) {
        return ResponseEntity.ok(itensDaVendaService.save(dto));
    }

   @PutMapping(path = "/editar")
    public ResponseEntity<ItensDaVenda> atualizarItensDaVenda(@RequestBody ItensDaVendaDto dto) {
           return ResponseEntity.ok(itensDaVendaService.atualizarItensDaVenda(dto));
    }




}
