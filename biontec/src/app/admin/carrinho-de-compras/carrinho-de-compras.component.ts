import {Component, OnInit} from '@angular/core';
import {VendasService} from "../../services/vendas.service";
import {ItensVdService} from "../../services/itens-vd.service";
import {iItensVd} from "../../interfaces/itens-vd";
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

  // -------------------------
  // 🛒 CARREGAR CARRINHO
  // -------------------------

  loadCart() {
    this.purchaseState.getSale().subscribe(sale => {

      if (!sale || !sale.productIds?.length) {
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
            return {
              ...p,
              qtdVd: p.qtdVd || 1,
              highlighted: true
            };
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
        error: (err) => {
          console.error('Erro ao carregar carrinho', err);
          this.carregando = false;
        }
      });
    });
  }

  // -------------------------
  // 💰 TOTAL
  // -------------------------

  calcularTotal() {
    this.total = this.listVds.reduce((acc, vendedor) => {
      return acc + vendedor.produtos.reduce((sum: number, p: iProduto) => {
        return sum + (p.valorVenda || 0) * (p.qtdVd || 1);
      }, 0);
    }, 0);
  }

  // -------------------------
  // ➕ QUANTIDADE
  // -------------------------

  alterarQuantidade(produto: iProduto, delta: number) {
    produto.qtdVd = (produto.qtdVd || 1) + delta;

    if (produto.qtdVd < 1) produto.qtdVd = 1;

    this.calcularTotal();
  }

  // -------------------------
  // ❌ REMOVER
  // -------------------------

  removerProduto(produto: iProduto) {

    this.listVds.forEach(v => {
      v.produtos = v.produtos.filter((p:any) => p.idProduto !== produto.idProduto);
    });

    // remove do service também 🔥
    this.purchaseState.removeSelectedProduct(produto.idProduto);

    this.listVds = this.listVds.filter(v => v.produtos.length > 0);

    this.calcularTotal();
  }

  // -------------------------
  // ✔ SELEÇÃO
  // -------------------------

  toggleTodos() {
    this.listVds.forEach(v => {
      v.selecionado = this.selecionarTodos;

      v.produtos.forEach((p:any) => p.highlighted = this.selecionarTodos);
    });

    this.calcularTotal();
  }

  toggleVendedor(vendedor: iVendas) {
    vendedor.selecionado = !vendedor.selecionado;

    vendedor.produtos.forEach((p:any) => p.highlighted = vendedor.selecionado);

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

  // -------------------------
  // 🧾 FINALIZAR
  // -------------------------

  continuarCompra() {
    const produtosSelecionados = this.listVds
      .flatMap(v => v.produtos)
      .filter((p:any) => p.highlighted);

    console.log('Compra:', produtosSelecionados);

    alert(`Total: R$ ${this.total.toFixed(2)}`);
  }

  // -------------------------
  // 🖼️ IMAGEM
  // -------------------------

  getImageUrl(foto: string): string {
    return foto
      ? 'data:image/jpeg;base64,' + foto
      : 'assets/img/no-image.jpg';
  }
}
