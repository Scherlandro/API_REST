import {Component, OnInit} from '@angular/core';
import {VendasService} from "../../services/vendas.service";
import {ItensVdService} from "../../services/itens-vd.service";
import {ActivatedRoute} from "@angular/router";
import {iItensVd} from "../../interfaces/itens-vd";
import {iVendas} from "../../interfaces/vendas";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {Observable} from "rxjs";

@Component({
  selector: 'app-carrinho-de-compras',
  templateUrl: './carrinho-de-compras.component.html',
  styleUrls: ['./carrinho-de-compras.component.css']
})
export class CarrinhoDeComprasComponent implements OnInit {
  selectedProduct: iProduto | null = null; // Alterado para armazenar o produto completo
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
    private purchaseState: PurchaseStateService,
    private vendasService: VendasService,
    private itensVdService: ItensVdService,
    private prodService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.itenSelecionado();
    this.route.paramMap.subscribe(params => {
      console.log('Param do onit', params)
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

  itenSelecionado(){ // launchingPurchaseToShoppingCart
    this.purchaseState.getSaleOfSelectedProduct().subscribe(sale => {
      if (sale) {
        console.log('Detalhe de venda iniciada', sale)
      //  this.loadProductDetails(sale);
      }
    });
  }


  loadProductDetails(productId: number) {
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        // Assumindo que a API retorna o produto diretamente ou em response.body
       // this.selectedProduct = response.body || response;
        this.venda.itensVd = response.body || response;
        // Opcional: destacar o produto na lista
        if (this.venda.itensVd) {
          console.log('Detalhe dos ITENS', this.venda.itensVd)
          // Destaca o produto na lista
         // this.highlightProductInList(this.selectedProduct.idProduto);

          // Rolagem automática para o produto destacado (opcional)
          setTimeout(() => {
            const element = document.querySelector('.highlighted');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
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
    // Aqui inicializa uma nova venda com dados padrão
    // ou carrega do localStorage se for um carrinho temporário
    this.venda = {
      idVenda: 0,
      idCliente: 0, // pode obter do serviço de autenticação
      nomeCliente: '', // pode obter do serviço de autenticação
      idFuncionario: 0, // pode obter do serviço de autenticação
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
      // Na API real precisarei de um método para deletar itens
      // Enquanto não tenho no serviço, vou simular com o editElement
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
