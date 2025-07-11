package com.biontecapi.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biontecapi.model.Pais;
import com.biontecapi.repository.PaisRepository;

/*import javax.websocket.server.PathParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import javax.xml.ws.soap.AddressingFeature;
import java.nio.charset.StandardCharsets;*/

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/paises")
public class PaisController {

    @Autowired
    private PaisRepository repository;


    @GetMapping(path = "/all")
    public ResponseEntity<List<Pais>>listarPaises(){
        return ResponseEntity.ok(repository.findAll());
    }


        @GetMapping(path = "/{id_paises}")
        public ResponseEntity consultarPaisPorId(@PathVariable("id_paises") Integer id_paises){
            return repository.findById(id_paises).map(record -> ResponseEntity.ok().body(record))
                    .orElse(ResponseEntity.notFound().build());
        }


    @GetMapping(value = "/buscarPorNomeDoPais")
    public ResponseEntity consultarPaisPorNome(@RequestParam(name ="nome_pais") String nome_pais){
        return Arrays.stream(repository.busarPorNome_pais(nome_pais).toArray()).findFirst().map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }

/*
    @GET
    @Path( "/{nome_pais}")
        public Response consultarPaisPorNome(@PathParam("nome_pais") String nome_pais) {
         return Response.ok(repository).entity(nome_pais).build();
          //  return Response.status(200).entity(nome_pais).build();
    }
@GetMapping(path = "/{nome_pais}")
public Response consultarPaisPorNome(@PathVariable("nome_pais") String nome_pais) {
   // return Response.ok((nome_pais).toString()).build();
   // return ResponseEntity.ok(nome_pais);
          https://mkyong.com/webservices/jax-rs/jax-rs-queryparam-example/

          https://stackoverflow.com/questions/11552248/when-to-use-queryparam-vs-pathparam

                     */

}


