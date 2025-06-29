package com.biontecapi.controller;

import com.biontecapi.model.Cliente;
import com.biontecapi.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository repository;

    @GetMapping(path = "/all")
    public ResponseEntity<List<Cliente>> listarClientes(){
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping(path = "/{id_cliente}")
    public ResponseEntity consultar(@PathVariable("id_cliente") Integer id_cliente){
        return repository.findById(id_cliente).map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping(path = "/salvar")
    public Cliente salvar(@RequestBody Cliente cliente){
        return repository.save(cliente);
    }

    @PutMapping(path = "/editar")
    public Cliente editar(@RequestBody Cliente cliente){
        return repository.save(cliente);
    }

    @DeleteMapping(path = "/delete/{id_cliente}")
    public void excluir(@PathVariable("id_cliente") Integer id_cliente){
        repository.deleteById(id_cliente);
    }
}

