package com.biontecapi.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.biontecapi.dtos.ClienteDTO;
import com.biontecapi.model.Cliente;
import com.biontecapi.service.ClienteService;


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
         return ResponseEntity.ok(clis.stream().map(Cliente::toDTO).toList());
    }

    @GetMapping(path = "/list-id/{id_cliente}")
    public ResponseEntity<ClienteDTO> consultarPorID(@PathVariable("id_cliente") Integer id_cliente) {
        Optional<Cliente> cli = clienteService.findById(id_cliente);
        return cli.map(Cliente::toDTO).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/list-name/{nomeCliente}")
    public ResponseEntity<List<ClienteDTO>> consultarPorNome(@PathVariable("nomeCliente") String nomeCliente){
       List<Cliente> cli = clienteService.listarClientePorNome(nomeCliente);
        return ResponseEntity.ok(cli.stream().map(Cliente::toDTO).toList());
        /*return cli.map(Cliente::toDTO).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());*/
    }

    @PostMapping(path = "/salvar")
    @ResponseStatus(HttpStatus.CREATED)
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

