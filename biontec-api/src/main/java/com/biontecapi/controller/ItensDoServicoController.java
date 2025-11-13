package com.biontecapi.controller;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

public class ItensDoServicoController {


    @Autowired
    private ItensDoServicoService ItensDoServicoService;
    @Autowired
    private ModelMapper mapper;


    @GetMapping(path = "/all")
    public ResponseEntity<List<ItensDoServicoDTO>> listarItensDoServico() {
        List<ItensDoServico> list = ItensDoServicoService.findAll();
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorCliente")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorCliente(@RequestParam(name = "nome") String nome) {
        List<ItensDoServicoDTO> list = ItensDoServicoService.litarItemDoServicoPorCliente(nome);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorIdProduct")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorIdProd(@RequestParam(value = "id") Integer id) {
        List<ItensDoServicoDTO> list = ItensDoServicoService.listarItensOSPorIdProduto(id);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorIdOS")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorIdVd(@RequestParam(value = "id") Integer id) {
        List<ItensDoServicoDTO> list = ItensDoServicoService.listarItensDoServicoPorId(id);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorData")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorData(@RequestParam(name = "data") String data) {
        List<ItensDoServicoDTO> list = ItensDoServicoService.litarItemDoServicoPorData(data);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/ItensOSEntreDatas")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdEntreDatas(
            @RequestParam(name = "dtIni") String dtIni, @RequestParam(name = "dtFinal") String dtFinal) {
        List<ItensDoServicoDTO> list = ItensDoServicoService.ConsultarItensOSEntreDatas(dtIni, dtFinal);
      /*  if(!list.isEmpty()){
            return ResponseEntity.notFound().eTag("Não encontrado").build();
            //   return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else */
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }




}
