import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  forkJoin,
  map,
  of,
  switchMap
} from "rxjs";
import { startWith } from "rxjs/operators";
import { iCartItens } from "../../interfaces/cart-itens";
import { ICliente } from "../../interfaces/cliente";
import { iPagamento } from "../../interfaces/pagamento";
import { iProduto } from "../../interfaces/product";
import { IUser } from "../../interfaces/user";
import { iVendas } from "../../interfaces/vendas";
import { AuthService } from "../../services/auth.service";
import { CartItensService } from "../../services/cart-items.service";
import { ClienteService } from "../../services/cliente.service";
import { ProductService } from "../../services/product.service";
import { PurchaseStateService } from "../../services/purchase-state.service";
import { UserService } from "../../services/user.service";
import { DialogPagamentosComponent } from "../../shared/dialogs/dialog-pagamentos/dialog-pagamentos.component";
import { ErrorDiologComponent } from "../../shared/dialogs/error-diolog/error-diolog.component";


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
  clientesFiltradvenda!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);
  selectedUser!: string;

  constructor(
    private authService: AuthService,
    private carrinhoDeCompraService: CartItensService,
    private prodService: ProductService,
    private userService: UserService,
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private purchaseState: PurchaseStateService
  ) {
  }

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    this.loadInitialData();
  //  this.setupAutocompleteFilters();
  }

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
        const detalheRequests = itensCart.map(item =>
          this.prodService.getIdProduto(item.productId).pipe(
            map((res: any) => {
              const dadosDoProduto = res.body;
              return {
                ...item,
                idProduto: item.productId,
                nomeProduto: dadosDoProduto.nomeProduto,
                fotoProduto: dadosDoProduto.fotoProduto,
                valorVenda: dadosDoProduto.valorVenda,
                qtdVd: item.quantity,
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
        // O return aqui para o próximo operador receber os dados
        return forkJoin(detalheRequests);
      }),
      //  Formata em iVendas[] usado no HTML
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
      },
      error: (err: any) => {
        this.onError('Erro ao carregar detalhes dos produtos.');
        console.error(err);
      }
    });
  }

  setupAutocompleteFilters() {

    this.clientesFiltradvenda = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.clienteService.getClientePorNome(value)
          : of([])
      ),
      catchError(() => of([])),
     // takeUntil(this.destroy$)
    );
  }

  displayCli(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

  onClienteSelecionado(event: any) {
    this.cliente$ = event.option.value;
    console.log('Cliente efetivamente selecionado:', this.cliente$);
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
    this.selecionarTodos = this.listVds.every(v => v.selecionado);
    this.calcularTotal();
  }

  continuarCompra() {
    this.clienteControl.markAsTouched();

    if (this.clienteControl.invalid || !this.cliente$) {
      this.onError('Por favor, selecione um cliente antes de continuar.');
      return;
    }
    //const cartData: any = { ...this.listVds };
    const cartData: any = this.listVds[0];
    console.log('1 Cart para venda->', cartData)
    const origem: iVendas = {
      idVenda: cartData.idVenda,
      cliente: cartData.cliente,
      idFuncionario: cartData.idFuncionario,
      nomeFuncionario: cartData.nomeFuncionario,
      dtVenda: cartData.dtVenda,
      subtotal: cartData.subtotal,
      desconto: cartData.desconto,
      totalgeral: this.total,
      formasDePagamento: cartData.formasDePagamento,
      qtdDeParcelas: cartData.qtdDeParcelas,
      itensVd: cartData.itensVd || cartData.iItensVd
    };
    console.log('2 Cart para venda ->', origem)

    const novoPagamento: iPagamento = {
      origemId: origem.idVenda,
      pagador: this.cliente$,
      tipoOrigem: 'CART',
      status: 1,
      dtPagamento: origem.dtVenda,
      valorPago: this.total,
      formaPagamento: origem.formasDePagamento
    };

    console.log('3 Cart para venda ->', novoPagamento)

    const dadosFormatados = JSON.stringify(novoPagamento, null, 2);

   // alert("Conferência do Novo Pagamento:\n\n" + dadosFormatados);

    this.dialog.open(DialogPagamentosComponent, {
      data: { ...novoPagamento }
    });
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
