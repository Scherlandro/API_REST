package com.biontecapi.service;

import com.biontecapi.model.ContasAReceber;
import com.biontecapi.model.Vendas;
import java.util.List;

public interface ContasAReceberService {

    List<ContasAReceber> listarTodas();

    List<ContasAReceber> listarPorVenda(Integer idVenda);

     void quitarParcela(Integer idConta, String formaPagamento);

     void gerarParcelasVenda(Vendas venda);

    List<ContasAReceber> listarInadimplentes();

    void delete(Integer id);

}
