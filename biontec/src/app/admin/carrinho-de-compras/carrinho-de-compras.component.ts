import {Component, OnInit} from '@angular/core';
import {VendasService} from "../../services/vendas.service";
import {ItensVdService} from "../../services/itens-vd.service";
import {iItensVd} from "../../interfaces/itens-vd";
import {iVendas} from "../../interfaces/vendas";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {forkJoin, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {IUser} from "../../interfaces/user";
import {UserService} from "../../services/user.service";

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
//  vendedores: Vendedor[] = [];
  vendedores: iVendas[] = [];
  nomeVendedor = '';
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
    itensVd: [],
      produtos:[]
  };

  carregando: boolean = true;
  erroCarregamento: string | null = null;

  constructor(
    private purchaseState: PurchaseStateService,
  //  private usuario: IUser,
    private userService: UserService,
    private vendasService: VendasService,
    private itensVdService: ItensVdService,
    private prodService: ProductService
  ) { }

  ngOnInit(): void {
   this.launchingPurchaseToShoppingCart();
    this.carregarCarrinho();
    this.calcularTotal();
  }

  launchingPurchaseToShoppingCart() {
    this.purchaseState.getSaleOfSelectedProduct().subscribe(vetor => {
      if (vetor[0]) { this.consultarPorNome(vetor[0]); }
      if (vetor[1]) { this.loadProductDetails(vetor[1]); }
      this.calcularTotal();
    });
  }

  consultarPorNome(nome: string) {
      this.userService.getUserByUserName(nome)
        .subscribe((res:IUser) => {
          this.nomeVendedor = res.name;
        });
  }

  loadProductDetails(productId: number) {
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        if (response) {
          this.carregando = true;
          // Garantir que selectedProduct seja um array
          this.selectedProduct = Array.isArray(response.body) ? response.body : [response.body];
          // Rolagem automática para o produto destacado (opcional)
          setTimeout(() => {
            const element = document.querySelector('.highlighted');
            if (element) {
              element.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
          }, 500);
        }
        this.carregarVenda(this.highlighted);
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
      }
    });
  }

  carregarVenda(idVenda: any): void {
    this.carregando = true;
    this.erroCarregamento = null;

    if (idVenda == true) {
      if (this.selectedProduct) {
        // Garantir que produtos seja um array
        const produtosArray = Array.isArray(this.selectedProduct) ? this.selectedProduct : [this.selectedProduct];
        // Criar array de vendedores
      /*  this.vendedores = [{
          vendedor: this.nomeVendedor,
          selecionado: false,
          produtos: produtosArray
        }];*/
        this.vendedores = [{
          idVenda: 0,
          idCliente: 0,
          nomeCliente: '',
          idFuncionario: 0,
          nomeFuncionario: this.nomeVendedor,
          dtVenda: new Date().toISOString(),
          subtotal: "0",
          desconto: "0",
          totalgeral: "0",
          formasDePagamento: "Cartão de Crédito",
          qtdDeParcelas: 1,
          itensVd: [],
          produtos:produtosArray,
          selecionado: false,
        }];

        console.log('this.vendedores->', this.vendedores);
        this.calcularTotal();
      }
    } else {
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
    // Nova venda com dados padrão
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
      itensVd: [],
      produtos: []
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

  toggleTodos() {
    this.vendedores.forEach(vendedor => {
      vendedor.selecionado = this.selecionarTodos;
    });
    this.calcularTotal();
  }

  toggleVendedor(vendedor: iVendas) {
    vendedor.selecionado = !vendedor.selecionado;
    // Verificar se todos os vendedores estão selecionados
    this.selecionarTodos = this.vendedores.every(v => v.selecionado);
    this.calcularTotal();
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
    // produto.qtdVendidas = Math.max(1, produto.qtdVendidas + delta);
    if (produto.qtdVendidas < 1) produto.qtdVendidas = 1;
    this.calcularTotal();
  }

  removerProduto(produto: iProduto) {
    this.vendedores.forEach(vendedor => {
      vendedor.produtos = vendedor.produtos.filter(p => p !== produto);
    });
    // Remover vendedores sem produtos
    this.vendedores = this.vendedores.filter(v => v.produtos.length > 0);
     this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.vendedores.reduce((acc, vendedor) => {
      return acc + vendedor.produtos.reduce((sum, produto) => {
        const quantidade = produto.qtdVendidas || 1;
        const valor = produto.valorVenda || 0;
        return sum + (valor * quantidade);
      }, 0);
    }, 0);
  }

  continuarCompra() {
    const produtosSelecionados = this.vendedores
      .flatMap(v => v.produtos)
      .filter(p => p.highlighted);

    console.log('Produtos para compra:', produtosSelecionados);
    alert(`Você está comprando ${produtosSelecionados.length} produto(s).`);
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



}
