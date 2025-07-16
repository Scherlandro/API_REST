package com.biontecapi.controller;

import com.biontecapi.dtos.ClienteDTO;
import com.biontecapi.model.Cliente;
import com.biontecapi.service.ClienteService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;
    @Autowired
    private ModelMapper mapper;

    @GetMapping(path = "/all")
    public ResponseEntity<List<ClienteDTO>> listarClientes(){
       List<Cliente> clis = clienteService.listarCliente();
         return ResponseEntity.ok(clis.stream().map(
                 c -> mapper.map(c, ClienteDTO.class))
                 .collect(Collectors.toList()));
    }

    @GetMapping(path = "/{id_cliente}")
    public ResponseEntity consultar(@PathVariable("id_cliente") Integer id_cliente){
        return clienteService.findById(id_cliente).map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/buscarPorNome")
    public ResponseEntity<List<ClienteDTO>> consultarPorNome(@RequestParam("nome_cliente") String nome_cliente){
       List<Cliente> clis = clienteService.listarClientePorNome(nome_cliente);
        return  ResponseEntity.ok(clis.stream().map(
                c -> mapper.map(c, ClienteDTO.class))
                .collect(Collectors.toList()));
    }

    @PostMapping(path = "/salvar")
    public Cliente salvar(@RequestBody Cliente cliente){
        return clienteService.save(cliente);
    }

    @PutMapping(path = "/editar")
    public Cliente editar(@RequestBody Cliente cliente){
        return clienteService.save(cliente);
    }

    @DeleteMapping(path = "/delete/{id_cliente}")
    public void excluir(@PathVariable("id_cliente") Integer id_cliente){
        clienteService.delete(id_cliente);
    }
}

