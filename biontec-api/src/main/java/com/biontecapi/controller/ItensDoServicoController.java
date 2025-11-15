package com.biontecapi.controller;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import com.biontecapi.service.ItensOSService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/itensDaOS")
public class ItensDoServicoController {


    private final ItensOSService itensOSService;

    @Autowired
    private ModelMapper mapper;

    public ItensDoServicoController(ItensOSService itensOSService){
        this.itensOSService = itensOSService;
    }

     @PostMapping(path = "/salvar")
        @ResponseStatus(HttpStatus.CREATED)
        public ResponseEntity salvar(@RequestBody ItensDoServicoDTO itensDto) {
         itensOSService.saveOS(mapper.map(itensDto, ItensDoServico.class));
            Optional<ItensDoServico> itensOptional = itensOSService.findById(itensDto.idItensDaOS());
            return ResponseEntity.ok(itensOptional.map(
                    e-> mapper.map(e, ItensDoServicoDTO.class)).map( r->ResponseEntity.ok().body(r))
                    .orElse(ResponseEntity.notFound().build()));
        }


    @GetMapping(path = "/all")
    public ResponseEntity<List<ItensDoServicoDTO>> listarItensDoServico() {
        List<ItensDoServico> list = itensOSService.findAll();
        return ResponseEntity.ok(list.stream().map(ItensDoServico:: toDTO).toList());
    }

    @GetMapping(value = "/buscarPorCliente")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorCliente(@RequestParam(name = "nome") String nome) {
        List<ItensDoServicoDTO> list = itensOSService.litarItemOSPorCliente(nome);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorIdProduct")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorIdProd(@RequestParam(value = "id") Integer id) {
        List<ItensDoServicoDTO> list = itensOSService.listarItensOSPorIdProduto(id);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorIdOS")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorIdVd(@RequestParam(value = "id") Integer id) {
        List<ItensDoServicoDTO> list = itensOSService.listarItensOSPorIdProduto(id);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/buscarPorData")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdPorData(@RequestParam(name = "data") String data) {
        List<ItensDoServicoDTO> list = itensOSService.litarItensOSPorData(data);
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping(value = "/ItensOSEntreDatas")
    public ResponseEntity<List<ItensDoServicoDTO>> ConsultarItensVdEntreDatas(
            @RequestParam(name = "dtIni") String dtIni, @RequestParam(name = "dtFinal") String dtFinal) {
        List<ItensDoServicoDTO> list = itensOSService.ConsultarItensOSEntreDatas(dtIni, dtFinal);
      /*  if(!list.isEmpty()){
            return ResponseEntity.notFound().eTag("Não encontrado").build();
            //   return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else */
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }




}
