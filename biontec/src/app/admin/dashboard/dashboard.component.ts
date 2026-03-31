import {Component, OnInit, ViewChild} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import { PageEvent} from "@angular/material/paginator";
import {iProduto} from "../../interfaces/product";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../services/product.service";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {MatDialog} from "@angular/material/dialog";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  selectedUser!: string;
  cartProducts: iProduto[] = [];

  spiner = false;
  pageSize = 20;
  currentPage = 0;

  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];

  produtoControl = new FormControl();

  constructor(
    private authService: AuthService,
    private router: Router,
    private prodService: ProductService,
    private purchaseState: PurchaseStateService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    this.listarProdutos();
    this.loadCartProducts();
  }

  // -------------------------
  // 🔹 CARRINHO
  // -------------------------

  loadCartProducts() {
    this.purchaseState.getSelectedProducts().subscribe(ids => {
      this.cartProducts = [];

      ids.forEach(id => {
        this.prodService.getIdProduto(id).subscribe(res => {
          this.cartProducts.push(res.body || res);
        });
      });
    });
  }

  addToCart(productId: number) {
    this.purchaseState.addSelectedProduct(productId);
  }

  removeFromCart(productId: number) {
    this.purchaseState.removeSelectedProduct(productId);
  }

  isInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  // 👉 FINALIZA COMPRA COM TODOS
  goToCart() {
    const ids = this.purchaseState.getSelectedProductsValue();

    if (ids.length === 0) {
      console.warn('Carrinho vazio');
      return;
    }

    this.purchaseState.startSale(this.selectedUser);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }

  // 👉 COMPRA DIRETA
  buyNow(productId: number) {
    this.purchaseState.clearCart();
    this.purchaseState.addSelectedProduct(productId);

    this.purchaseState.startSale(this.selectedUser);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }

  // -------------------------
  // 🔹 PRODUTOS
  // -------------------------

  listarProdutos() {
    this.spiner = true;

    this.prodService.getTodosProdutos().subscribe({
      next: (res: iProduto[]) => {
        this.products = res;
        this.produtosFiltrados = res;
        this.updatePagedProdutos();
        this.spiner = false;
      },
      error: () => {
        this.spiner = false;
        this.onError('Erro ao carregar produtos');
      }
    });
  }

  consultarPorNome(nome: string) {
    if (!nome) {
      this.produtosFiltrados = this.products;
    } else {
      nome = nome.toLowerCase();
      this.produtosFiltrados = this.products.filter(p =>
        p.nomeProduto.toLowerCase().includes(nome)
      );
    }

    this.currentPage = 0;
    this.updatePagedProdutos();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProdutos();
  }

  updatePagedProdutos() {
    const start = this.currentPage * this.pageSize;
    this.pagedProdutosFiltrados =
      this.produtosFiltrados.slice(start, start + this.pageSize);
  }

  getImageUrl(foto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:image/jpeg;base64,' + foto
    );
  }

  onError(msg: string) {
    this.dialog.open(ErrorDiologComponent, { data: msg });
  }
}
