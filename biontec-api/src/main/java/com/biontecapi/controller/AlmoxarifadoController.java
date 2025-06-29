package com.biontecapi.controller;


import com.biontecapi.dtos.AlmoxarifadoDto;
import com.biontecapi.model.Almoxarifado;
import com.biontecapi.service.AlmoxarifadoService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/almoxarifado")
public class AlmoxarifadoController {


    final AlmoxarifadoService almoxarifadoService;


    public AlmoxarifadoController(AlmoxarifadoService almoxarifadoService) {
        this.almoxarifadoService = almoxarifadoService;
    }

    @GetMapping("/")
    public ResponseEntity<Object> listAlmoxarifado(){
        List<Almoxarifado> almoxarifadoList = almoxarifadoService.findAll();
        if(almoxarifadoList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        return ResponseEntity.status(HttpStatus.OK).body(almoxarifadoList);

    }

    @GetMapping("/{id_veiculo}")
    public ResponseEntity<Object> getAlmoxarifado(@PathVariable(value = "id_veiculo") Integer id_veiculo){
        Optional<Almoxarifado> almoxarifadoOptional = almoxarifadoService.findById(id_veiculo);
        if(!almoxarifadoOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        return ResponseEntity.status(HttpStatus.OK).body(almoxarifadoOptional.get());
    }

    @PostMapping("/salvar")
    public ResponseEntity<Object> saveAlmoxarifado(@RequestBody @Valid AlmoxarifadoDto almoxarifadoDto){
        if(almoxarifadoService.existsByPlaca(almoxarifadoDto.getPlaca())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflict: Plate Car is already is use!");
        }
        /* obs:É desnecessário a verificação de disponibilidade de um objeto se ele está sendo criado nesse momento

        if(almoxarifadoServices.existsByDisponibilidade(almoxarifadoDto.getDisponibilidade())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflict: Vehicle is not available!");
        }
         */

        Almoxarifado almoxarifadoModel = new Almoxarifado();
        BeanUtils.copyProperties(almoxarifadoDto, almoxarifadoModel);
        almoxarifadoModel.setDt_saida(LocalDateTime.now(ZoneId.of("UTC")));
        almoxarifadoModel.setDt_entrada(LocalDateTime.now(ZoneId.of("UTC")));
        return ResponseEntity.status(HttpStatus.CREATED).body(almoxarifadoService.save(almoxarifadoModel));

    }

    @PutMapping("/{id_veiculo}")
    public ResponseEntity<Object> updateAlmoxarifado(@PathVariable(value = "id_veiculo") Integer id_veiculo ,
                                                     @RequestBody @Valid AlmoxarifadoDto almoxarifadoDto){
        Optional<Almoxarifado> almoxarifadoModelOptional = almoxarifadoService.findById(id_veiculo);
        if(!almoxarifadoModelOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        Almoxarifado almoxarifadoModel = new Almoxarifado();
        BeanUtils.copyProperties(almoxarifadoDto, almoxarifadoModel);
        almoxarifadoModel.setId_store(almoxarifadoModelOptional.get().getId_store());
        almoxarifadoModel.setDt_saida(LocalDateTime.now(ZoneId.of("UTC")));
        almoxarifadoModel.setDt_entrada(LocalDateTime.now(ZoneId.of("UTC")));
        return ResponseEntity.status(HttpStatus.CREATED).body(almoxarifadoService.save(almoxarifadoModel));

    }





}
