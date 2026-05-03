import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {forkJoin, of, switchMap, take} from "rxjs";
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
  spiner = false;
  isBanner$ = this.purchaseState.showBanner$;
  pageSize = 20;
  currentPage = 0;
  cartCount$ = this.purchaseState.getCartCount();
  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();

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
    this.isBanner$.subscribe(valor => {
      console.log('O valor real do banner é:', valor, 'Vlaor prod', this.selectedProduct);
    });
    if (this.selectedUser) {
      // Prioridade total ao Banco de Dados se estiver logado
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
      }
    });
  }


  loadProductDetails(productId: number) {
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        this.selectedProduct = response.body || response;
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
      }
    });
  }

  addToCart(productId: number) {
    const email = this.selectedUser;
    if (!email) {
      this.onError('Usuário não identificado.');
      return;
    }
    this.userService.getUserByUserName(email).subscribe({
      next: (user: IUser) => {
        this.carrinhoDeCompraService.getItemCartForUser(user.id_usuario, productId).subscribe({
          next: (res: any) => {
            if (res) {
              this.notificationMsg.warn('Produto já está no carrinho!');
            } else {
              this.buyNow(productId);
              //this.saveToCart(user.id_usuario, productId);
            }}, error: () => this.buyNow(productId)  // this.goToShoppingCart(productId) //this.saveToCart(user.id_usuario, productId) // Se der 404, assume que não existe
        });}
    });
  }

  private saveToCart(userId: number, productId: number) {
    const toCard = { userId, productId, quantity: 1 };
    this.carrinhoDeCompraService.addCartItens(toCard).subscribe({
      next: () => {
        this.notificationMsg.success('Produto adicionado!');
        this.loadCartProductsFromDatabase(userId);
        this.purchaseState.showBanner(true);
      },
      error: (err) => this.onError('Erro ao salvar item.')
    });
  }

  buyNow(productId: number) {
    if (!this.purchaseState.isProductInCart(productId)) {
     // this.purchaseState.addSelectedProduct(productId);
      this.loadProductDetails(productId);
    }
  }

  private loadCartProductsFromDatabase(userId: number) {
    this.carrinhoDeCompraService.getCartofUser(userId).subscribe({
      next: (cartItems: any[]) => {
        // Extrai os IDs dos produtos do carrinho
        const productIds = cartItems.map(item => item.productId);
        this.purchaseState.syncCartFromDatabase(productIds);
        this.loadCartProducts(); // Recarrega os detalhes
      },
      error: (err) => console.error('Erro ao carregar carrinho do banco:', err)
    });
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

  goToShoppingCart(productId?: number) {
    const localIds = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');

    // Se houver itens no localStorage, salva no BD antes de ir para o carrinho
    if (localIds.length > 0 && this.selectedUser) {

      this.userService.getUserByUserName(this.selectedUser).subscribe(user => {
        const requests = localIds.map((id:any) =>
          this.carrinhoDeCompraService.addCartItens({ userId: user.id_usuario, productId: id, quantity: 1 })
        );

        forkJoin(requests).subscribe(() => {
          this.purchaseState.syncCartFromDatabase([]); // Limpa local após salvar
          //this.purchaseState.updateCountFromDatabase(this.selectedUser);
          this.refreshCartFromDatabase(); // Atualiza contador com dados do BD
          this.finalizeNavigation();
        });
      });
    } else {
      this.finalizeNavigation();
    }
  }

  private finalizeNavigation() {
    this.purchaseState.showBanner(false);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }


  loadCartProducts() {
    this.purchaseState.getSelectedProducts().pipe(
      switchMap(ids => {
        if (!ids || ids.length === 0) return of([]);

        // Criamos o array de chamadas
        const requests = ids.map(id => this.prodService.getIdProduto(id));

        // Usamos o spread operator (...) para satisfazer a tipagem do forkJoin
        return forkJoin([...requests]);
      })
    ).subscribe({
      next: (responses: any[]) => {
        this.cartProducts = responses.map((res: any) => res.body || res);
      },
      error: (err) => console.error('Erro ao carregar produtos do carrinho:', err)
    });
  }


  clearHighlight() {
    this.selectedProduct = null;
   // this.purchaseState.clearSale();
    this.purchaseState.showBanner(false);
    this.highlightProductInList(-1);
  }

  removeFromCart(productId: number) {
    this.purchaseState.removeSelectedProduct(productId);
  }

  isInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
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



  getImageUrl(foto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:image/jpeg;base64,' + foto
    );
  }

  onError(msg: string) {
    this.dialog.open(ErrorDiologComponent, {data: msg});
  }
}
