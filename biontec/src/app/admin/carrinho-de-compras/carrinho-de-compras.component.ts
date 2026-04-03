import {Component, OnInit} from '@angular/core';
import {iVendas} from "../../interfaces/vendas";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {forkJoin, of} from "rxjs";
import {ICliente} from "../../interfaces/cliente";


@Component({
  selector: 'app-carrinho-de-compras',
  templateUrl: './carrinho-de-compras.component.html',
  styleUrls: ['./carrinho-de-compras.component.css']
})
export class CarrinhoDeComprasComponent implements OnInit {

  selecionarTodos = true;
  listVds: iVendas[] = [];
  total = 0;
  carregando = true;
  cliente$!: ICliente;

  constructor(
    private purchaseState: PurchaseStateService,
    private prodService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.purchaseState.getSale().subscribe(sale => {
      if (!sale || !sale.productIds || sale.productIds.length === 0) {
        this.listVds = [];
        this.carregando = false;
        return;
      }

      const requests = sale.productIds.map((id: number) =>
        this.prodService.getIdProduto(id)
      );

      forkJoin(requests).subscribe({
        next: (responses:any) => {
          const produtos = responses.map((res:any) => {
            const p = res.body || res;
            return { ...p, qtdVd: p.qtdVd || 1, highlighted: true };
          });

          this.listVds = [{
            idVenda: 0,
            cliente: this.cliente$,
            idFuncionario: 0,
            nomeFuncionario: sale.userName,
            dtVenda: new Date().toISOString(),
            subtotal: 0,
            desconto: 0,
            totalgeral: 0,
            formasDePagamento: "Cartão de Crédito",
            qtdDeParcelas: 1,
            itensVd: [],
            produtos: produtos,
            selecionado: true
          }];
          this.calcularTotal();
          this.carregando = false;
        },
        /*error: (err) => {
          console.error('Erro ao carregar carrinho', err);
          this.carregando = false;
        }*/
      });
    });
  }

  calcularTotal() {
    this.total = this.listVds.reduce((acc, vendedor) => {
      return acc + vendedor.produtos.reduce((sum: number, p: any) => {
        // Somente soma se o produto estiver marcado
        if (p.highlighted) {
          return sum + (p.valorVenda || 0) * (p.qtdVd || 1);
        }
        return sum;
      }, 0);
    }, 0);
  }

  alterarQuantidade(produto: iProduto, delta: number) {
    produto.qtdVd = (produto.qtdVd || 1) + delta;
    if (produto.qtdVd < 1) produto.qtdVd = 1;
    this.calcularTotal();
  }

  removerProduto(produto: iProduto) {
    this.listVds.forEach(v => {
      v.produtos = v.produtos.filter((p:any) => p.idProduto !== produto.idProduto);
    });
    this.purchaseState.removeSelectedProduct(produto.idProduto);
    this.listVds = this.listVds.filter(v => v.produtos.length > 0);
    this.calcularTotal();
   // this.loadCart();
  }

  toggleTodos() {
    this.listVds.forEach(v => {
      v.selecionado = this.selecionarTodos;
      v.produtos.forEach((p:any) => p.highlighted = this.selecionarTodos);
    });
    this.calcularTotal();
  }

  toggleVendedor(vendedor: iVendas) {
   vendedor.produtos.forEach((p: any) => p.highlighted = vendedor.selecionado);

    this.selecionarTodos = this.listVds.every(v => v.selecionado);
    this.calcularTotal();
  }

  verificarSelecao() {
    this.selecionarTodos = this.listVds.every(v =>
      v.produtos.every((p:any) => p.highlighted)
    );

    this.listVds.forEach(v => {
      v.selecionado = v.produtos.every((p:any) => p.highlighted);
    });

    this.calcularTotal();
  }

  continuarCompra() {
    const produtosSelecionados = this.listVds
      .flatMap(v => v.produtos)
      .filter((p:any) => p.highlighted);
    console.log('Compra:', produtosSelecionados);
    alert(`Total: R$ ${this.total.toFixed(2)}`);
  }

  getImageUrl(foto: string): string {
    return foto
      ? 'data:image/jpeg;base64,' + foto
      : 'assets/img/no-image.jpg';
  }
}
