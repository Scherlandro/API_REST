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

import com.biontecapi.dtos.ProdutoDto;
import com.biontecapi.model.Produto;
import com.biontecapi.service.ProdutoService;


    @CrossOrigin(origins = "*")
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {

        @Autowired
        private ProdutoService prod_serv;
        @Autowired
        private ModelMapper mapper;

        // @PreAuthorize("hasRole('ADMIN')")
        @GetMapping(path = "/all")
        public ResponseEntity<List<ProdutoDto>> listarProdutos() {
            List<Produto> list = prod_serv.listarProduto();
            return ResponseEntity.ok(list.stream().map(
                    e-> mapper.map(e, ProdutoDto.class))
                    .collect(Collectors.toList()));
        }

        @GetMapping(path = "/{id_produto}")
        public ResponseEntity consultar(@PathVariable("id_produto") Integer id_produto) {
            Optional<Produto> prod = prod_serv.findById(id_produto);
            return ResponseEntity.ok(prod.map(
                    e-> mapper.map(e, ProdutoDto.class)).map( r->ResponseEntity.ok().body(r))
                    .orElse(ResponseEntity.notFound().build()));
        }

        @GetMapping(value = "/buscarPorNome")
        public ResponseEntity<List<ProdutoDto>> consultarPorNome(@RequestParam(name = "nomeProduto") String nome) {
            List<Produto> list = prod_serv.listarProdutoPorNome(nome);
            return ResponseEntity.ok(list.stream().map(
                    e-> mapper.map(e, ProdutoDto.class))
                    .collect(Collectors.toList()));
        }

        @PostMapping(path = "/salvar")
        @ResponseStatus(HttpStatus.CREATED)
        public ResponseEntity salvar(@RequestBody ProdutoDto produtoDto) {
            prod_serv.save(mapper.map(produtoDto, Produto.class));
            Optional <Produto> prodOptional = prod_serv.findById(produtoDto.getIdProduto());
            return ResponseEntity.ok(prodOptional.map(
                    e-> mapper.map(e, ProdutoDto.class)).map( r->ResponseEntity.ok().body(r))
                    .orElse(ResponseEntity.notFound().build()));
        }

        @PutMapping(path = "/editar/{id_produto}")
        public ResponseEntity editar(@PathVariable("id_produto") Integer idprod,
                                              @RequestBody ProdutoDto produtoDto) {
            if (!prod_serv.existsById(idprod)) {
                return ResponseEntity.notFound().build();
            }
               // produto.setId_produto(idprod);
            prod_serv.save(mapper.map(produtoDto, Produto.class));
            Optional <Produto> prodOptional = prod_serv.findById(produtoDto.getIdProduto());
            return ResponseEntity.ok(prodOptional.map(
                    e-> mapper.map(e, ProdutoDto.class)).map( r->ResponseEntity.ok().body(r))
                    .orElse(ResponseEntity.notFound().build()));
        }

        @DeleteMapping(path = "/delete/{id_produto}")
        public ResponseEntity excluir(@PathVariable("id_produto") Integer id) {
             prod_serv.delete(id);
            return ResponseEntity.noContent().build();
        }
    }

