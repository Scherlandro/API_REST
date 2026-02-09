package com.biontecapi.serviceImpl;

import com.biontecapi.model.ContasAReceber;
import com.biontecapi.model.Pagamentos;
import com.biontecapi.model.Vendas;
import com.biontecapi.repository.ContasAReceberRepository;
import com.biontecapi.repository.PagamentosRepository;
import com.biontecapi.service.ContasAReceberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class  ContasAReceberServiceImpl implements ContasAReceberService {

    @Autowired
    private ContasAReceberRepository repository;

    @Autowired
    private PagamentosRepository pagamentosRepository;

    @Override
    public List<ContasAReceber> listarTodas() {
        return repository.findAll();
    }

    @Override
    public List<ContasAReceber> listarPorVenda(Integer idVenda) {
        return repository.findByOrigemIdAndTipoOrigem(idVenda, "VENDA");
    }

    @Override
    @Transactional
    public void quitarParcela(Integer idConta, String formaPagamento) {
        ContasAReceber conta = repository.findById(idConta)
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada"));

        if (!"PENDENTE".equals(conta.getStatus())) {
            throw new RuntimeException("Esta parcela já foi quitada ou cancelada.");
        }

        // 1. Atualiza a Parcela
        conta.setStatus("PAGO");
        conta.setDataPagamento(LocalDate.now());
        repository.save(conta);

        // 2. Gera o registro financeiro em Pagamentos (Para o Fechamento de Caixa)
        Pagamentos pagamento = new Pagamentos();
        pagamento.setValorPago(conta.getValorParcela());
        pagamento.setDtPagamento(LocalDateTime.now());
        pagamento.setFormaPagamento(formaPagamento);
        pagamento.setOrigemId(conta.getIdContaReceber());
        pagamento.setTipoOrigem("CONTA_RECEBER");
        pagamento.setStatus(1); // 1 = Confirmado

        pagamentosRepository.save(pagamento);
    }

    /*    @Transactional
    @Override
    public void quitarParcela(Integer idConta, String formaPagamento) {
        ContasAReceber conta = repository.findById(idConta).get();
        conta.setStatus("PAGO");
        conta.setDataPagamento(LocalDate.now());
        repository.save(conta);

        // Registra no financeiro (Pagamentos) para aparecer no fechamento de caixa
        Pagamentos pagamento = new Pagamentos();
        pagamento.setValorPago(conta.getValorParcela());
        pagamento.setFormaPagamento(formaPagamento);
        pagamento.setOrigemId(conta.getIdContaReceber());
        pagamento.setTipoOrigem("CONTA_RECEBER");
        pagamento.setStatus(1);

        pagamentosRepository.save(pagamento);
    }*/

    @Override
    public void gerarParcelasVenda(Vendas venda) {
        double valorParcela = venda.getTotalgeral() / venda.getQtdDeParcelas();
        for (int i = 1; i <= venda.getQtdDeParcelas(); i++) {
            ContasAReceber conta = new ContasAReceber();
            conta.setOrigemId(venda.getIdVenda());
            conta.setTipoOrigem("VENDA");
            conta.setNumeroParcela(i);
            conta.setValorParcela(valorParcela);
            conta.setDataVencimento(LocalDate.now().plusMonths(i));
            conta.setStatus("PENDENTE");
            repository.save(conta);
        }
    }

    @Override
    public List<ContasAReceber> listarInadimplentes() {

        /*
        Criar método para converter a entidade para o DTO RelatorioInadimplecia usando:

        ContasAReceber conta = new ContasAReceber();
        ChronoUnit.DAYS.between(conta.getDataVencimento(), LocalDate.now());

          para calcular os dias de atraso.
         */

        // Busca todas as parcelas PENDENTES com data de vencimento anterior a HOJE
        return repository.buscarContasAtrasadas(LocalDate.now());
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }


}
