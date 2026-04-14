import {Component, OnInit, ViewChild} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {forkJoin, Observable, of, switchMap} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {PageEvent} from "@angular/material/paginator";
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
  selectedProduct: iProduto | null = null;
  spiner = false;
  pageSize = 20;
  currentPage = 0;

  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];

  produtoControl = new FormControl();
  private carrinhoDeCompraService: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private prodService: ProductService,
    private purchaseState: PurchaseStateService,
    public dialog: MatDialog,
    public notificationMsg: NotificationMgsService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    this.listarProdutos();
    this.prodSelecionado();
    this.loadCartProducts();
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

  public getCartCount(): number {
    return this.purchaseState.getCartCount();
  }

  public isProductInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  //  COMPRA DIRETA
  showCard() {
     // this.purchaseState.clearCart();
   //  this.purchaseState.addSelectedProduct(productId);
     this.purchaseState.startSale(this.selectedUser);
     this.router.navigate(['/admin/carrinho-de-compras']);
   }

  buyNow(productId: number) {
    this.purchaseState.addSelectedProduct(productId);
    this.loadProductDetails(productId);
    this.showAddToCartNotification();
    // this.router.navigate(['/admin/carrinho-de-compras']); // REMOVA ESTA LINHA
  }

  showAddToCartNotification() {
    // Você pode implementar um snackbar ou toast aqui
    console.log('Produto adicionado ao carrinho!');
  }


  launchingPurchaseToShoppingCart(userName: string, productId: number) {
    if (userName == null || productId == null) {
      console.info('Usuário ou produto nulo', userName, productId)
    return;
    }
 /*   var prodId: number[] = [];
    for (const id of [productId]) {
      prodId.push(...[id]);
    }*/

    this.purchaseState.addSelectedProduct(productId);
    // Carrega os detalhes para mostrar no banner
    this.loadProductDetails(productId);
    //this.purchaseState.startSaleOfSelectedProduct(userName, prodId);
    this.purchaseState.startSale(userName);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }

  clearHighlight() {
    this.selectedProduct = null;
    // this.purchaseState.clearSelectedProduct();
   // this.purchaseState.clearSale();
 //   this.highlightProductInList(-1); // Passa um ID inválido para remover todos os destaques
  }

  addToCart(productId: number) {
    console.log('Objeto para Cart', productId)
    const toCard = {
      usuario: this.selectedUser, // Vem do this.authService.getUserName() no ngOnInit
      prodId: productId
    };
    this.carrinhoDeCompraService.adicionar(toCard).subscribe({
    next: (vendaCriada) => {
      this.notificationMsg.success('Produto adicionado ao carrinho!');
      // Atualiza o estado local
      this.purchaseState.addSelectedProduct(productId);
      this.loadProductDetails(productId);
        setTimeout(() => {
        const banner = document.querySelector('.selected-product-banner');
        if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    },
    error: (err) => {
      this.onError('Erro ao adicionar produto ao carrinho no servidor');
      console.error(err);
    }
  });

/*
    this.purchaseState.addSelectedProduct(productId);
    this.loadProductDetails(productId);
    setTimeout(() => {
      const banner = document.querySelector('.selected-product-banner');
      if (banner) { banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } }, 100);*/
  }

  removeFromCart(productId: number) {
    this.purchaseState.removeSelectedProduct(productId);
  }

  isInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  // FINALIZA COMPRA COM TODOS
  goToCart() {
    const ids = this.purchaseState.getSelectedProductsValue();
    console.log('Quantidade de ids ', ids)
    if (ids.length === 0) {
      //console.warn('Carrinho vazio');
      alert('Seu carrinho está vazio!');
      return;
    }
    this.spiner = true;

    this.purchaseState.saveSaleToDatabase(this.selectedUser).subscribe({
      next: (res) => {
        this.spiner = false;
        console.log('Venda salva no banco com ID:', res.id);
        this.router.navigate(['/admin/carrinho-de-compras']);
      },
      error: (err) => {
        this.spiner = false;
        console.error('Erro ao salvar no banco:', err);
        alert('Não foi possível salvar seu carrinho no momento. Tente novamente.');
      }
    });
    /*
       this.purchaseState.startSale(this.selectedUser);
       this.router.navigate(['/admin/carrinho-de-compras']);
    */
  }

  /*
  goToCart() {
  const ids = this.purchaseState.getSelectedProductsValue();

  if (ids.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  // Objeto estruturado com o usuário e a lista de IDs
  const payload = {
    username: this.selectedUser,
    produtosIds: ids, // Um array de números
    dataCriacao: new Date()
  };

  this.spiner = true;
  this.carrinhoDeCompraService.salvarCarrinhoCompleto(payload).subscribe({
    next: (res) => {
      this.spiner = false;
      this.router.navigate(['/admin/carrinho-de-compras']);
    },
    error: (err) => {
      this.spiner = false;
      this.onError('Erro ao processar carrinho');
    }
  });
}
   */


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
