import {Component, OnInit} from '@angular/core';
import {iVendas} from "../../interfaces/vendas";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {finalize, forkJoin, pipe, of, switchMap,catchError, map} from "rxjs";
import {ICliente} from "../../interfaces/cliente";
import {UserService} from "../../services/user.service";
import {IUser} from "../../interfaces/user";
import {CartItensService} from "../../services/cart-items.service";
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {iCartItens} from "../../interfaces/cart-itens";


@Component({
  selector: 'app-carrinho-de-compras',
  templateUrl: './carrinho-de-compras.component.html',
  styleUrls: ['./carrinho-de-compras.component.css']
})
export class CarrinhoDeComprasComponent implements OnInit {

  selecionarTodos = true;
  listVds: iVendas[] = [];
  listCar: iCartItens[]=[];
  total = 0;
  carregando = true;
  cliente$!: ICliente;
  selectedUser!: string;

  constructor(
    private authService: AuthService,
    private carrinhoDeCompraService: CartItensService,
    private prodService: ProductService,
    private userService: UserService,
    public dialog: MatDialog,
    private purchaseState: PurchaseStateService
  ) {
  }

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    this.loadInitialData();
  }

  /*
    const chamadas = itensCart.map(i => this.prodService.getIdProduto(i.productId));
        forkJoin(chamadas).subscribe(respostas => {
          const nomes: any = respostas.map((res: any) => //  res.body?.nomeProduto || 'Sem nome'
          res.body
          );
          console.log('Nomes dos produtos:', nomes.map((i:any)=>i.nomeProduto));
        });
   */

  loadInitialData() {
    this.carregando = true;
    const email = this.selectedUser;
    if (!email) {
      this.onError('Usuário não identificado.');
      this.carregando = false;
      return;
    }
    this.userService.getUserByUserName(email).pipe(
      switchMap((user: IUser) => this.carrinhoDeCompraService.getCartofUser(user.id_usuario)),
      // Transforma cada item simples em um produto detalhado
      switchMap((itensCart: any[]) => {
        if (!itensCart || itensCart.length === 0) {
          return of([]);
        }
        this.listCar = itensCart;
        console.log('DETALHE DO itensCart',itensCart)
        const detalheRequests = itensCart.map(item =>
          this.prodService.getIdProduto(item.productId).pipe(
            map((res: any) => {
              // AQUI foi necessário acessar o .body
              const dadosDoProduto = res.body;
              return {
                ...item,
                idProduto: item.productId,        // Sincroniza o ID
                nomeProduto: dadosDoProduto.nomeProduto,
                fotoProduto: dadosDoProduto.fotoProduto,
                valorVenda: dadosDoProduto.valorVenda,
                qtdVd: item.quantity,  // Mapeia quantity para qtdVd
                highlighted: true
              };
            }),
            catchError(() => of({
              ...item,
              idProduto: item.productId,
              nomeProduto: 'Produto não encontrado',
              highlighted: true,
              qtdVd: item.quantity
            })) ) );
        // O return aqui é fundamental para o próximo operador receber os dados
        return forkJoin(detalheRequests);
      }),
      //  Formata para o padrão iVendas[] usado no HTML
      map((produtosDetalhados: any[]) => {
        return [{
          idVenda: 0,
          nomeFuncionario: this.selectedUser,
          selecionado: true,
          produtos: produtosDetalhados
        }];
      }),

      finalize(() => this.carregando = false)
    ).subscribe({
      next: (resultado: any[]) => {
        this.listVds = resultado;
        this.calcularTotal();
        console.log('Carrinho Final formatado e populado:', this.listVds);
      },
      error: (err: any) => {
        this.onError('Erro ao carregar detalhes dos produtos.');
        console.error(err);
      }
    });
  }

  calcularTotal() {
    this.total = this.listVds.reduce((acc, vendedor) => {
      const subtotalVendedor = vendedor.produtos.reduce((sum: number, p: any) => {
        return p.highlighted ? sum + (p.valorVenda * (p.qtdVd || 1)) : sum;
      }, 0);
      return acc + subtotalVendedor;
    }, 0);
  }

  removerProduto(cartItens: iCartItens) {
    const email = this.selectedUser;
    if (!email) {
      this.onError('Usuário não identificado.');
      return;
    }

        this.carrinhoDeCompraService.delete(cartItens.id).subscribe(() => {
          this.listVds.forEach(v => {
            v.produtos = v.produtos.filter((p: any) => p.idProduto !== cartItens.productId);
          });
          // Remove vendedores que ficaram sem produtos
          this.listVds = this.listVds.filter(v => v.produtos.length > 0);
          this.purchaseState.removeSelectedProduct(cartItens.productId);
          this.calcularTotal();
        });


  }

  alterarQuantidade(produto: iProduto, delta: number) {
    produto.qtdVd = (produto.qtdVd || 1) + delta;
    if (produto.qtdVd < 1) produto.qtdVd = 1;
    this.calcularTotal();
  }

  toggleTodos() {
    this.listVds.forEach(v => {
      v.selecionado = this.selecionarTodos;
      v.produtos.forEach((p: any) => p.highlighted = this.selecionarTodos);
    });
    this.calcularTotal();
  }

  toggleVendedor(vendedor: iVendas) {
    vendedor.produtos.forEach((p: any) => p.highlighted = vendedor.selecionado);
    this.selecionarTodos = this.listVds.every(v => v.selecionado);
    this.calcularTotal();
  }

  verificarSelecao() {
    this.listVds.forEach(v => {
      v.selecionado = v.produtos.every((p: any) => p.highlighted);
    });
  /*  this.selecionarTodos = this.listVds.every(v =>
      v.produtos.every((p: any) => p.highlighted)
    );*/
    this.selecionarTodos = this.listVds.every(v => v.selecionado);
    this.calcularTotal();
  }

  continuarCompra() {
    const irParaVenda = this.listVds;
      /*.flatMap((v:iVendas) => v.produtos)
      .filter((p: iProduto) => p.nomeProduto);*/
    console.log('Compra:', irParaVenda);
    alert(`Descrição ${irParaVenda} Total: R$ ${this.total.toFixed(2)}`);
  }

  getImageUrl(foto: string): string {
    return foto
      ? 'data:image/jpeg;base64,' + foto
      : 'assets/img/no-image.jpg';
  }


  onError(msg: string) {
    this.dialog.open(ErrorDiologComponent, {data: msg});
  }
}
