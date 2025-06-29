package com.biontecapi.controller;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;
import com.biontecapi.repository.ItensDaVendaRepository;
import com.biontecapi.service.ItensDaVendaService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/itensDaVenda")
public class ItensVendaController {

    @Autowired
    private ItensDaVendaService itensDaVendaService;
    @Autowired
    private ModelMapper mapper;


    @GetMapping(path = "/all")
    public ResponseEntity<List<ItensDaVendaDto>> listarItensDaVenda() {
        List<ItensDaVenda> list = itensDaVendaService.findAll();
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDaVendaDto.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorCliente")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorCliente(@RequestParam(name = "nome") String nome) {
        List<ItensDaVendaDto> list = itensDaVendaService.litarItemDaVendaPorCliente(nome);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDaVendaDto.class))
                .collect(Collectors.toList()));
    }


    @GetMapping(value = "/buscarPorIdVd")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorIdVd(@RequestParam(value = "id") Integer id) {
        List<ItensDaVendaDto> list = itensDaVendaService.listarItensDaVdPorId(id);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDaVendaDto.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorData")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdPorData(@RequestParam(name = "data") String data) {
        List<ItensDaVendaDto> list = itensDaVendaService.litarItemDaVendaPorData(data);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDaVendaDto.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/ItensVdEntreDatas")
    public ResponseEntity<List<ItensDaVendaDto>> ConsultarItensVdEntreDatas(
            @RequestParam(name = "dtIni") String dtIni, @RequestParam(name = "dtFinal") String dtFinal) {
        List<ItensDaVendaDto> list = itensDaVendaService.ConsultarItensVdEntreDatas(dtIni, dtFinal);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDaVendaDto.class))
                .collect(Collectors.toList()));
    }


       /* List<Object> itensDaVd = itensDaVendaService.ConsultarItensVdEntreDatas(dtIni, dtFinal);
              if(!itensDaVd.isEmpty()){
            return ResponseEntity.notFound().eTag("Não encontrado").build();
               //   return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
              }
                  }
        */

}
