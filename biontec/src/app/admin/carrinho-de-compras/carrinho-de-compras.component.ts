import {Component, OnInit} from '@angular/core';
import {VendasService} from "../../services/vendas.service";
import {ItensVdService} from "../../services/itens-vd.service";
import {ActivatedRoute} from "@angular/router";
import {iItensVd} from "../../interfaces/itens-vd";
import {iVendas} from "../../interfaces/vendas";

@Component({
  selector: 'app-carrinho-de-compras',
  templateUrl: './carrinho-de-compras.component.html',
  styleUrls: ['./carrinho-de-compras.component.css']
})
export class CarrinhoDeComprasComponent implements OnInit {
  venda: iVendas = {
    idVenda: 0,
    idCliente: 0,
    nomeCliente: '',
    idFuncionario: 0,
    nomeFuncionario: '',
    dtVenda: new Date().toISOString(),
    subtotal: "0",
    desconto: "0",
    totalgeral: "0",
    formasDePagamento: "Cartão de Crédito",
    qtdDeParcelas: 1,
    itensVd: []
  };

  carregando: boolean = true;
  erroCarregamento: string | null = null;

  constructor(
    private vendasService: VendasService,
    private itensVdService: ItensVdService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idVenda = params.get('id');
      if (idVenda) {
        this.carregarVenda(idVenda);
      } else {
        this.inicializarNovaVenda();
      }
    });
  }

  carregarVenda(idVenda: string): void {
    this.carregando = true;
    this.erroCarregamento = null;

    this.vendasService.getVendaPorCod(idVenda).subscribe({
      next: (venda) => {
        this.venda = venda;
        this.carregarItensVenda(idVenda);
      },
      error: (err) => {
        this.erroCarregamento = 'Erro ao carregar a venda';
        this.carregando = false;
        console.error(err);
      }
    });
  }

  carregarItensVenda(idVenda: string): void {
    this.itensVdService.listarItensVdPorCodVenda(idVenda).subscribe({
      next: (itens: iItensVd[]) => {
        this.venda.itensVd = itens;
        this.calcularTotais();
        this.carregando = false;
      },
      error: (err) => {
        this.erroCarregamento = 'Erro ao carregar os itens da venda';
        this.carregando = false;
        console.error(err);
      }
    });
  }

  inicializarNovaVenda(): void {
    // Aqui você pode inicializar uma nova venda com dados padrão
    // ou carregar do localStorage se for um carrinho temporário
    this.venda = {
      idVenda: 0,
      idCliente: 0, // Você pode obter do serviço de autenticação
      nomeCliente: '', // Você pode obter do serviço de autenticação
      idFuncionario: 0, // Você pode obter do serviço de autenticação
      nomeFuncionario: 'Atendente Virtual',
      dtVenda: new Date().toISOString(),
      subtotal: "0",
      desconto: "0",
      totalgeral: "0",
      formasDePagamento: "Cartão de Crédito",
      qtdDeParcelas: 1,
      itensVd: []
    };
    this.carregando = false;
  }

  calcularTotais(): void {
    const subtotal = this.venda.itensVd.reduce((sum, item) => sum + item.valorParcial, 0);
    this.venda.subtotal = subtotal.toFixed(2);

    // Simulando desconto de 10% para compras acima de R$ 1000
    const desconto = subtotal > 1000 ? subtotal * 0.1 : 0;
    this.venda.desconto = desconto.toFixed(2);

    const total = subtotal - desconto;
    this.venda.totalgeral = total.toFixed(2);
  }

  alterarQuantidade(item: iItensVd, operacao: number): void {
    item.qtdVendidas += operacao;

    if (item.qtdVendidas < 1) {
      item.qtdVendidas = 1;
    }

    item.valorParcial = item.qtdVendidas * item.valVenda;

    // Atualizar item no backend
    this.itensVdService.editElement(item).subscribe({
      next: () => this.calcularTotais(),
      error: (err) => console.error('Erro ao atualizar item:', err)
    });
  }

  removerItem(index: number): void {
    const item = this.venda.itensVd[index];
    const itemId = item.idItensVd;

    if (itemId) {
      // Na API real, você precisaria de um método para deletar itens
      // Como não temos no serviço, vou simular com o editElement
      // Em produção, crie um método delete no serviço
      this.itensVdService.editElement(item).subscribe({
        next: () => {
          this.venda.itensVd.splice(index, 1);
          this.calcularTotais();
        },
        error: (err) => console.error('Erro ao remover item:', err)
      });
    } else {
      this.venda.itensVd.splice(index, 1);
      this.calcularTotais();
    }
  }

  adicionarItem(novoItem: iItensVd): void {
    this.itensVdService.createElements(novoItem).subscribe({
      next: (itemCriado) => {
        this.venda.itensVd.push(itemCriado);
        this.calcularTotais();
      },
      error: (err) => console.error('Erro ao adicionar item:', err)
    });
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  finalizarCompra(): void {
    if (this.venda.idVenda) {
      // Atualizar venda existente
      this.vendasService.updateVenda(this.venda).subscribe({
        next: () => {
          alert('Compra atualizada com sucesso!');
          // Redirecionar ou fazer outra ação
        },
        error: (err) => console.error('Erro ao atualizar venda:', err)
      });
    } else {
      // Criar nova venda
      this.vendasService.addVenda(this.venda).subscribe({
        next: (vendaCriada) => {
          alert('Compra finalizada com sucesso!');
          this.venda = vendaCriada;
          // Redirecionar ou fazer outra ação
        },
        error: (err) => console.error('Erro ao criar venda:', err)
      });
    }
  }
}
