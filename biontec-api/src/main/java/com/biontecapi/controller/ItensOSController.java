package com.biontecapi.controller;

import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import com.biontecapi.model.OrdemDeServico;
import com.biontecapi.service.ItensOSService;
import com.biontecapi.service.OrdemDeServicoService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/itensDaOS")
public class ItensOSController {


    private final ItensOSService itensOSService;
    private final OrdemDeServicoService osService;
    private final ModelMapper mapper;

    public ItensOSController(ItensOSService itensOSService, OrdemDeServicoService osService, ModelMapper mapper){
        this.itensOSService = itensOSService;
        this.osService = osService;
        this.mapper = mapper;
    }

    @PostMapping("/salvar")
    public ResponseEntity salvar(@RequestBody ItensDoServico item) {
       return ResponseEntity.status(HttpStatus.CREATED).body(itensOSService.saveItemOS(item));
    }
/*

    @PostMapping("/itens")
    public ResponseEntity<ItensDoServico> criarItem(@RequestBody ItensDoServicoDTO dto) {

        OrdemDeServico os = osService.findById(dto.codOS())
                .orElseThrow(() -> new RuntimeException("OS não encontrada"));

        ItensDoServico item = new ItensDoServico();
        item.setCodOS(os.getIdOS());
        item.setDescricao(dto.descricao());
        item.setQuantidade(dto.quantidade());
        item.setValorUnitario(dto.valorUnitario());

        return ResponseEntity.ok(itensOSService.saveItemOS(item));
    }

*/

  /*  @PutMapping("/editar")
    public ResponseEntity<ItensDoServico> atualizarOS( @RequestBody ItensDoServicoDTO itensDto) {
        if (!itensOSService.existsById(itensDto.idItensDaOS())) {
            return ResponseEntity.notFound().build();
        }
        ItensDoServico entidade = mapper.map(itensDto, ItensDoServico.class);
      //  entidade.setIdItensDaOS(idItensDaOS);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itensOSService.updateItemOS(entidade));
    }

    @PutMapping("/editar")
    public ResponseEntity<ItensDoServico> atualizarOS(@RequestBody ItensDoServicoDTO itensDto) {
        if (!itensOSService.existsById(itensDto.idItensDaOS())) {
            return ResponseEntity.notFound().build();
        }
        // Busca a entidade existente para garantir que o Hibernate a rastreie (Managed State)
        ItensDoServico entidade = mapper.map(itensDto, ItensDoServico.class);
        // Força o ID do DTO na entidade mapeada
        entidade.setIdItensDaOS(itensDto.idItensDaOS());
        return ResponseEntity.ok(itensOSService.updateItemOS(entidade));
    }
*/
  @PutMapping("/editar")
  public ResponseEntity<?> atualizarOS(@RequestBody ItensDoServicoDTO itensDto) {
      if (!itensOSService.existsById(itensDto.idItensDaOS())) {
          return ResponseEntity.notFound().build();
      }

      // Em vez de usar apenas o mapper, garanta os campos principais
      ItensDoServico entidade = mapper.map(itensDto, ItensDoServico.class);

      // FORÇAR os valores do Record para a Entidade
      entidade.setIdItensDaOS(itensDto.idItensDaOS());
      entidade.setValorUnitario(itensDto.valorUnitario()); // Aqui o Record usa o nome do campo como método
      entidade.setQuantidade(itensDto.quantidade());
      entidade.setCodOS(itensDto.codOS());
      entidade.setCodProduto(itensDto.codProduto());
      entidade.setDescricao(itensDto.descricao());

      return ResponseEntity.ok(itensOSService.updateItemOS(entidade));
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
        if(!list.isEmpty()){
            return ResponseEntity.notFound().eTag("Não encontrado").build();
           //  return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else
        return ResponseEntity.ok(list.stream().map(
                e -> mapper.map(e, ItensDoServicoDTO.class))
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/delete/{idItensDaOS}")
    public ResponseEntity<Void> excluir(@PathVariable Long idItensDaOS) {
        itensOSService.delete(idItensDaOS);
        return ResponseEntity.noContent().build();
    }


}
