import {Component, OnInit} from '@angular/core';
import {VendasService} from "../../services/vendas.service";
import {ItensVdService} from "../../services/itens-vd.service";
import {ActivatedRoute} from "@angular/router";
import {iItensVd} from "../../interfaces/itens-vd";
import {iVendas} from "../../interfaces/vendas";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {forkJoin, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

interface Vendedor {
  vendedor: string;
  selecionado: boolean;
  produtos: iProduto[];
}

@Component({
  selector: 'app-carrinho-de-compras',
  templateUrl: './carrinho-de-compras.component.html',
  styleUrls: ['./carrinho-de-compras.component.css']
})
export class CarrinhoDeComprasComponent implements OnInit {
  selecionarTodos: boolean = false;
  vendedores: Vendedor[] = [];
  nomeVendedor = '';
  matriz: {[key: number]: any} = {};
  total: number = 0;
  selectedProduct!: iProduto[];
  highlighted = true;
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
    this.launchingPurchaseToShoppingCart();

    this.carregarCarrinho();
    this.calcularTotal();

/*    this.route.paramMap.subscribe(params => {
      console.log('Param do onit', params)
      const idVenda = params.get('id');
      console.log('idVenda do ngOnInit', idVenda)
      if (idVenda) {
        this.carregarVenda(idVenda);
      } else {
        this.inicializarNovaVenda();
      }
    });*/
  }


  launchingPurchaseToShoppingCart(){
    this.purchaseState.getSaleOfSelectedProduct().subscribe(sale => {
      if (sale && sale.length > 0) {
        sale.forEach((vetor:any) => {
          if (vetor > 0) {
            this.loadProductDetails(vetor)
          } else {
            this.nomeVendedor = vetor
            console.log('Vendedor ->', this.matriz,  this.nomeVendedor);
            //matriz[vetor.vendedor] = [];
            //this.matriz[0] = [];
          }
        });
        // Calcular total inicial
        this.calcularTotal();
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


  loadProductDetails(productId: number) {
    console.log('Entrando no produto', productId);
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        if(response) {
          this.highlighted = true;
          // Assumindo que a API retorna o produto diretamente ou em response.body
          this.selectedProduct = response.body;

          if (this.selectedProduct) {
            // Criar array de vendedores
            this.vendedores = [ {
              vendedor: this.nomeVendedor,
              selecionado: false,
              produtos: this.selectedProduct
            }];

            // Rolagem automática para o produto destacado (opcional)
            setTimeout(() => {
              const element = document.querySelector('.highlighted');
              if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'center'});
              }
            }, 500);
          }
        }
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
      }
    });
  }




  carregarItensVenda2(idVenda: string): void {
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
/*

  alterarQuantidade(item: iProduto, operacao: number): void {
    if (operacao !== 0) {
      item.qtdVendidas += operacao;
    }
    if (item.qtdVendidas < 1) {
      item.qtdVendidas = 1;
    }
    item.valorVenda = item.qtdVendidas * item.valorVenda;
    this.calcularTotais();
    // Atualizar item no backend
    this.prodService.editElement(item).subscribe({
      next: () => this.calcularTotais(),
      error: (err) => console.error('Erro ao atualizar item:', err)
    });
  }
*/

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

  carregarItensVenda(idVenda: string): void {
    this.itensVdService.listarItensVdPorCodVenda(idVenda).subscribe({
      next: (itens: iItensVd[]) => {
        // Buscar imagem de cada item
        const requisicoes = itens.map(item =>
          this.prodService.getProdutoPorCod(item.codProduto).pipe(
            map(prod => {
              console.log('Item carregado', prod)
              const produto = prod.body || prod;
              item.fotoProduto = produto.fotoProduto
                ? this.getImageUrl(produto.fotoProduto)
                : 'assets/img/no-image.jpg';
              return item;
            }),
            catchError(() => {
              item.fotoProduto = 'assets/img/no-image.jpg';
              return of(item);
            })
          )
        );

        forkJoin(requisicoes).subscribe({
          next: (itensComImagem) => {
            this.venda.itensVd = itensComImagem;
            this.calcularTotais();
            this.carregando = false;
          },
          error: (err) => {
            console.error('Erro ao carregar imagens:', err);
            this.venda.itensVd = itens; // fallback sem imagens
            this.calcularTotais();
            this.carregando = false;
          }
        });
      },
      error: (err) => {
        this.erroCarregamento = 'Erro ao carregar os itens da venda';
        this.carregando = false;
        console.error(err);
      }
    });
  }

  getImageUrl(fotoProduto: string): string {
    if (!fotoProduto) return 'assets/img/no-image.jpg';
    return 'data:image/jpeg;base64,' + fotoProduto;
  }

  carregarCarrinho() {
   // this.vendedores
    /*= [
     {
        id: 1,
        nome: 'Loja A',
        selecionado: false,
        produtos: [
          {
            id: 101,
            nome: 'Mouse Gamer RGB',
            imagem: 'https://via.placeholder.com/50',
            preco: 120.00,
            precoOriginal: 150.00,
            desconto: true,
            quantidade: 1,
            selecionado: false
          },
          {
            id: 102,
            nome: 'Teclado Mecânico ABNT2',
            imagem: 'https://via.placeholder.com/50',
            preco: 250.00,
            quantidade: 1,
            selecionado: false
          }
        ]
      },
      {
        id: 2,
        nome: 'Loja B',
        selecionado: false,
        produtos: [
          {
            id: 201,
            nome: 'Monitor Full HD 24"',
            imagem: 'https://via.placeholder.com/50',
            preco: 900.00,
            quantidade: 1,
            selecionado: false
          }
        ]
      }
    ];*/
  }

  toggleTodos() {
    this.vendedores.forEach(vendedor => {
      vendedor.selecionado = this.selecionarTodos;
    });

   /* this.vendedores.forEach(v => {
      v.selecionado = this.selecionarTodos;
      v.produtos.forEach(p => p.highlighted = this.selecionarTodos);
    });
    this.calcularTotal();*/
  }

  toggleVendedor(vendedor: Vendedor) {
    vendedor.selecionado = !vendedor.selecionado;
    // Verificar se todos os vendedores estão selecionados
    this.selecionarTodos = this.vendedores.every(v => v.selecionado);

  /*  vendedor.produtos.forEach(p => p.highlighted = vendedor.selecionado);
    this.verificarSelecao();
    this.calcularTotal();*/
  }

  verificarSelecao() {
    this.selecionarTodos = this.vendedores.every(v => v.produtos.every(p => p.highlighted = this.highlighted));
    this.vendedores.forEach(v => {
      v.selecionado = v.produtos.every(p => p.highlighted);
    });
    this.calcularTotal();
  }

  alterarQuantidade(produto: iProduto, delta: number) {
    produto.qtdVendidas = (produto.qtdVendidas || 1) + delta;
    if (produto.qtdVendidas < 1) produto.qtdVendidas = 1;


    // produto.qtdVendidas = Math.max(1, produto.qtdVendidas + delta);
    this.calcularTotal();
  }

  removerProduto(produto: iProduto) {
    this.vendedores.forEach(vendedor => {
      vendedor.produtos = vendedor.produtos.filter(p => p !== produto);
    });
    // Remover vendedores sem produtos
    this.vendedores = this.vendedores.filter(v => v.produtos.length > 0);

  /*  this.vendedores.forEach(v => {
      v.produtos = v.produtos.filter(p => p.idProduto !== produto.idProduto);
    });
    this.vendedores = this.vendedores.filter(v => v.produtos.length > 0);*/
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.vendedores.reduce((acc, vendedor) => {
      return acc + vendedor.produtos.reduce((sum, produto) => {
        return sum + (produto.valorVenda * (produto.qtdVendidas || 1));
      }, 0);
    }, 0);

   /* this.total = 0;
    this.vendedores.forEach(v => {
      v.produtos.forEach(p => {
        if (p.highlighted) {
          this.total += p.valorVenda * p.qtdVendidas;
        }
      });
    });*/
  }

  continuarCompra() {
    const produtosSelecionados = this.vendedores
      .flatMap(v => v.produtos)
      .filter(p => p.highlighted);

    console.log('Produtos para compra:', produtosSelecionados);
    alert(`Você está comprando ${produtosSelecionados.length} produto(s).`);
  }

}
