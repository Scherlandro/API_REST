package com.biontecapi.controller;

import com.biontecapi.dtos.FuncionarioDTO;
import com.biontecapi.model.Funcionario;
import com.biontecapi.service.FuncionarioService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;
    @Autowired
    private ModelMapper mapper;

    @GetMapping(path = "/all")
    public ResponseEntity<List<FuncionarioDTO>> listarFuncionarios(){
       List<Funcionario> funcs = funcionarioService.listarFuncionario();
         return ResponseEntity.ok(funcs.stream().map(Funcionario::toDTO).toList());
    }

    @GetMapping(path = "/list-id/{id_funcionario}")
    public ResponseEntity<FuncionarioDTO> consultarPorID(@PathVariable("id_funcionario") Integer id_funcionario) {
        Optional<Funcionario> func = funcionarioService.findById(id_funcionario);
        return func.map(Funcionario::toDTO).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/list-name/{nomeFuncionario}")
    public ResponseEntity<List<FuncionarioDTO>> consultarPorNome(@PathVariable("nomeFuncionario") String nomeFuncionario){
       List<Funcionario> func = funcionarioService.listarFuncionarioPorNome(nomeFuncionario);
        return ResponseEntity.ok(func.stream().map(Funcionario::toDTO).toList());
        /*return func.map(Funcionario::toDTO).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());*/
    }

    @PostMapping(path = "/salvar")
    @ResponseStatus(HttpStatus.CREATED)
    public Funcionario salvar(@RequestBody Funcionario funcionario){
        return funcionarioService.save(funcionario);
    }

    @PutMapping(path = "/editar")
    public Funcionario editar(@RequestBody Funcionario funcionario){
        return funcionarioService.save(funcionario);
    }

    @DeleteMapping(path = "/delete/{id_funcionario}")
    public void excluir(@PathVariable("id_funcionario") Integer id_funcionario){
        funcionarioService.delete(id_funcionario);
    }
}

