import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {forkJoin, of, Subscription, switchMap, take} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {PageEvent} from "@angular/material/paginator";
import {iProduto} from "../../interfaces/product";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../services/product.service";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {CartItensService} from "../../services/cart-items.service";
import {UserService} from "../../services/user.service";
import {IUser} from "../../interfaces/user";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  selectedUser!: string;
  cartProducts: iProduto[] = [];
  selectedProduct: any;
  selectedIdProdLoclSt = this.purchaseState.getProdSelect();
  spiner = false;
  isBanner$ = this.purchaseState.showBanner$;
  pageSize = 20;
  currentPage = 0;
  cartCount$ = this.purchaseState.getCartCount();
  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();

  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private prodService: ProductService,
    private userService: UserService,
    private purchaseState: PurchaseStateService,
    private carrinhoDeCompraService: CartItensService,
    public dialog: MatDialog,
    public notificationMsg: NotificationMgsService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    if (this.selectedUser) {
      this.refreshCartFromDatabase();
    }
    this.listarProdutos();
    this.loadCartProducts();
  }

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
      } });
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

  loadProductDetails(productId: number) {
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        this.selectedProduct = response.body || response;
      }, error: (err) => {
        console.error('Erro ao carregar produto:', err);
      } });
  }

 addToCart(productId: number) {
    const email = this.selectedUser;
    if (!email) return;
    this.userService.getUserByUserName(email).subscribe({
      next: (user: IUser) => {
        this.carrinhoDeCompraService.getItemCartForUser(user.id_usuario, productId).subscribe({
          next: (res: any) => {
            if (res) {
              this.notificationMsg.warn('Produto já está no carrinho!');
            } else {
              this.prodService.getIdProduto(productId).subscribe(response => {
                this.selectedProduct = response.body || response;
                this.purchaseState.addSelectedProduct(productId);
                this.purchaseState.showBanner(true);
                this.highlightProductInList(productId);
              });
            }} });
      } })
  }

  updatePagedProdutos() {
    const start = this.currentPage * this.pageSize;
    this.pagedProdutosFiltrados =
      this.produtosFiltrados.slice(start, start + this.pageSize);
  }

  private refreshCartFromDatabase() {
    this.userService.getUserByUserName(this.selectedUser).pipe(
      switchMap(user => this.carrinhoDeCompraService.getCartofUser(user.id_usuario)),
      take(1)
    ).subscribe({
      next: (cartItems) => {
        const ids = cartItems.map(item => item.productId);
        this.purchaseState.syncCartFromDatabase(ids);
      },
      error: (err) => console.error('Erro ao sincronizar banco:', err)
    });
  }

  goToShoppingCart() {
    const localIds = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');

    if (localIds.length > 0 && this.selectedUser) {
      this.userService.getUserByUserName(this.selectedUser).subscribe(user => {
        const requests = localIds.map((id: any) =>
          this.carrinhoDeCompraService.addCartItens({userId: user.id_usuario, productId: id, quantity: 1})
        );
        forkJoin(requests).subscribe(() => {
          this.purchaseState.syncCartFromDatabase([]);
          this.refreshCartFromDatabase();
          this.finalizeNavigation();
        });
      });
    } else {
      this.finalizeNavigation();
    }
  }

  loadCartProducts() {
    this.purchaseState.getSelectedProducts().pipe(
      switchMap(ids => {
        if (!ids || ids.length === 0)
        return of([]);
        const requests = ids.map(id => this.prodService.getIdProduto(id));
        return forkJoin([...requests]);
      })
    ).subscribe({
      next: (responses: any[]) => {
        this.cartProducts = responses.map((res: any) => res.body || res);
        if (this.cartProducts.length > 0 && !this.selectedProduct) {
          this.selectedProduct = this.cartProducts[this.cartProducts.length - 1];
        }
        if (this.selectedProduct) {
          this.highlightProductInList(this.selectedProduct.idProduto);
        }},
      error: (err) => console.error('Erro ao carregar produtos do carrinho:', err)
    });
  }

  highlightProductInList(productId: number) {
    this.products = this.products.map(p => ({
      ...p, highlighted: false
    }));
    this.products = this.products.map(p => {
      if (p.idProduto === productId) {
        return {...p, highlighted: true};
      }
      return p;
    });
    this.produtosFiltrados = [...this.products];
    this.updatePagedProdutos();
  }

  cleanProductStore(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const idsNoEstado = this.purchaseState.getSelectedIdsValue();
    if (idsNoEstado.length > 0) {
      const ultimoId = idsNoEstado[idsNoEstado.length - 1];
      this.purchaseState.removeSelectedProduct(ultimoId);
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProdutos();
  }

  getImageUrl(foto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:image/jpeg;base64,' + foto
    );
  }

  clearHighlight() {
    this.selectedProduct = null;
    this.purchaseState.showBanner(false);
    this.highlightProductInList(-1);
  }

  removeFromCart(productId: number) {
    this.purchaseState.removeSelectedProduct(productId);
  }

  isInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  trackById(index:any, item:any) { return item.idProduto; }

  onError(msg: string) { this.dialog.open(ErrorDiologComponent,{data: msg});
  }

  private finalizeNavigation() {
    this.purchaseState.showBanner(false);
    this.cleanProductStore();
    this.router.navigate(['/admin/carrinho-de-compras']);
  }

}

