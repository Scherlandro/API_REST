import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {forkJoin, of, switchMap} from "rxjs";
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
    const bannerSalvo = this.purchaseState.getBanner();
    this.purchaseState.showBanner(bannerSalvo);
    this.listarProdutos();
   // this.prodSelecionado();
   // this.loadCartProducts();
    this.processarPendenciasPosLogin();
  }

  private processarPendenciasPosLogin() {
    const pendingId = this.purchaseState.getStoredProductId();

    if (this.selectedUser) {
      this.userService.getUserByUserName(this.selectedUser).subscribe(user => {
        if (pendingId) {
          // Se tem algo no localStorage, salva no banco primeiro
          const toCart = { userId: user.id_usuario, productId: pendingId, quantity: 1 };

          this.carrinhoDeCompraService.addCartItens(toCart).subscribe({
            next: () => {
              // Após salvar com sucesso, limpamos o localStorage para não processar de novo
              this.purchaseState.clearStorageIds();
              // Agora carregamos o carrinho COMPLETO do banco
              this.atualizarEstadoGeralDoCarrinho(user.id_usuario, pendingId);
            },
            error: () => this.atualizarEstadoGeralDoCarrinho(user.id_usuario)
          });
        } else {
          // Se não tinha nada no localStorage, apenas carrega o que já era do usuário
          this.atualizarEstadoGeralDoCarrinho(user.id_usuario);
        }
      });
    }
  }

  private atualizarEstadoGeralDoCarrinho(userId: number, highlightId?: number) {
    this.carrinhoDeCompraService.getCartofUser(userId).subscribe(cartItems => {
      const dbIds = cartItems.map((item: any) => item.productId);

      // Atualiza o Service com os IDs REAIS do banco
      this.purchaseState.syncCartFromDatabase(dbIds);

      // Se houver um ID para destacar (o que foi adicionado agora), abre o banner
      if (highlightId) {
        this.loadProductDetails(highlightId);
        this.purchaseState.showBanner(true);
      }

      // Carrega os detalhes visuais de todos os produtos do banco para o banner/lista
      this.loadCartProducts();
    });
  }

  prodSelecionado() {
    this.purchaseState.getSelectedProducts().subscribe(productId => {
      if (productId && productId.length > 0) {
        const lastId = productId[productId.length - 1];
        this.loadProductDetails(lastId);
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

  // -------------------------
  // 🔹 CARRINHO
  // -------------------------
  loadCartProducts() {
    this.purchaseState.getSelectedProducts().pipe(
      switchMap(ids => {
        if (!ids || ids.length === 0) {
          return of([]);
        }
        const req = ids.map(id =>
          this.prodService.getIdProduto(id)
        );
        return forkJoin([...req]);
      })
    ).subscribe({
      next: (responses: any[]) => {
        this.cartProducts = responses.map(res => res.body || res);
      },
      error: (err) => console.error(err)
    });
  }

  public isProductInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  goToShoppingCart() {
    this.purchaseState.startShoppingCart(this.selectedUser);
    this.purchaseState.showBanner(false);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }

  buyNow(productId: number) {
    if (!this.purchaseState.isProductInCart(productId)) {
      this.purchaseState.addSelectedProduct(productId);
      this.loadProductDetails(productId);
    }
  }

  clearHighlight() {
    this.selectedProduct = null;
    this.purchaseState.clearSale();
    this.purchaseState.showBanner(false);
    this.highlightProductInList(-1);
  }

  addToCart(productId: number) {
    const email = this.selectedUser;

    if (!email) {
      this.onError('Usuário não identificado.');
      return;
    }
    if (this.purchaseState.isProductInCart(productId)) {
      this.notificationMsg.warn('Produto já está no carrinho!');
      return;
    }
    this.userService.getUserByUserName(email).subscribe({
      next: (user: IUser) => {
        const toCard = {
          userId: user.id_usuario,
          productId: productId,
          quantity: 1
        };
        this.carrinhoDeCompraService.addCartItens(toCard).subscribe({
          next: (cart: any) => {
            this.notificationMsg.success('Produto adicionado ao carrinho!');
            this.purchaseState.addSelectedProduct(productId);
            this.loadCartProductsFromDatabase(user.id_usuario);
            this.loadProductDetails(productId);
            this.purchaseState.showBanner(true);
            // Opcional: limpar o ID temporário para não repetir o processo no F5
            // localStorage.removeItem('selectedProductsIds');
          },
          error: (err: any) => {
            this.onError('Erro ao salvar item no carrinho.');
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao localizar o usuário:', err);
        this.onError('Não foi possível validar o usuário.');
      }
    });
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
    this.dialog.open(ErrorDiologComponent, {data: msg});
  }
}
