import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {DialogUsuarioComponent} from "../../shared/diolog_components/dialog-usuario/dialog-usuario.component";
import {MensagemService} from "../../services/mensagem.service";
import {Observable, of} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {iProduto} from "../../interfaces/product";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../services/product.service";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {MatDialog} from "@angular/material/dialog";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  events = new FormControl();
  selectedProduct: iProduto | null = null; // Alterado para armazenar o produto completo
  selectedUser!: string; //= { id: 0, name: '',  username: '' };
  cartProducts: iProduto[] = []; // Lista de produtos no carrinho

  mensagens!: Observable<string>;
  spiner = false;
  pageSize = 20;
  currentPage = 0;
  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  imageUrl: SafeUrl | undefined;

  constructor(
    private tokenServer: TokenService,
    private authService: AuthService,
    private router: Router,
    public notificationMsg: NotificationMgsService,
    private prodService: ProductService,
    private purchaseState: PurchaseStateService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.selectedUser = this.authService.getUserName();
    this.listarProdutos();
    this.prodSelecionado();
    this.loadCartProducts();
  }

  // Carrega os produtos do carrinho
  loadCartProducts() {
    this.purchaseState.getSelectedProducts().subscribe(productIds => {
     if (productIds && productIds.length > 0) {
       // Carrega os detalhes de todos os produtos no carrinho
        this.cartProducts = [];
        productIds.forEach(id => {
          this.prodService.getIdProduto(id).subscribe({
            next: (response) => {
              const product = response.body || response;
              this.cartProducts.push(product);
            },
            error: (err) => {
              console.error('Erro ao carregar produto:', err);
            }
          });
        });
      }
    });
  }

  // Adiciona produto ao carrinho
  addToCart(productId: number) {
    this.purchaseState.addSelectedProduct(productId);
    this.loadCartProducts(); // Atualiza a lista local
  }

  // Remove produto do carrinho
  removeFromCart(productId: number) {
    this.purchaseState.removeSelectedProduct(productId);
    this.cartProducts = this.cartProducts.filter(p => p.idProduto !== productId);
  }

  // Verifica se o produto está no carrinho
  isInCart(productId: number): boolean {
    return this.purchaseState.isProductInCart(productId);
  }

  // Prepara a compra com todos os produtos do carrinho
  preparePurchase(productId: number) {
    this.purchaseState.setSelectedProduct(productId);
    //const productIds = this.purchaseState.getSelectedProducts(); // Isso retorna o BehaviorSubject value
    const idsArray = this.purchaseState['selectedProductsIds'].value; // Acessando o value diretamente
    console.log('Vlor do idsArray'+1+ idsArray);
    if (idsArray.length > 0) {
      this.purchaseState.startSaleOfSelectedProduct(this.selectedUser, idsArray);
      this.router.navigate(['/admin/carrinho-de-compras']);
    } else {
      console.info('Nenhum produto no carrinho');
      // Você pode mostrar uma mensagem para o usuário aqui
    }
  }


  // Prepara compra de um produto específico (adiciona ao carrinho e vai para o carrinho)
  prepareSinglePurchase(productId: number) {
    this.addToCart(productId);
    this.purchaseState.startSaleOfSelectedProduct(this.selectedUser, [productId]);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }
  /*
    preparePurchase(productId: number) {
      this.purchaseState.startSaleOfSelectedProduct(this.selectedUser, productId);
      this.router.navigate(['/admin/carrinho-de-compras']);
    }
  */


  prodSelecionado(){
    this.purchaseState.getSelectedProduct().subscribe(productId => {
      if (productId) {  this.loadProductDetails(productId);  }  });
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

  // Método para destacar o produto na lista
  highlightProductInList(productId: number) {
    // Remove o destaque de todos os produtos primeiro
    this.products = this.products.map(p => ({
      ...p,
      highlighted: false
    }));

    // Aplica o destaque apenas ao produto selecionado
    this.products = this.products.map(p => {
      if (p.idProduto === productId) {
        return {
          ...p,
          highlighted: true
        };
      }
      return p;
    });

    // Atualiza a lista filtrada e paginada
    this.produtosFiltrados = [...this.products];
    this.updatePagedProdutos();
  }

  listarProdutos() {
    this.spiner = true;
    this.prodService.getTodosProdutos()
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      }))
      .subscribe((rest: iProduto[]) => {
        this.products = rest;
        this.produtosFiltrados = rest;
        this.updatePagedProdutos();
        this.spiner = false;
      });
  }

  getImageUrl(fotoProduto: string): SafeUrl {
    if (!fotoProduto) return '';
    const objectURL = 'data:image/jpeg;base64,' + fotoProduto;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  consultarPorNome(nomeProd: string) {
    if (!nomeProd || nomeProd.trim() === '') {
      this.produtosFiltrados = this.products;
    } else {
      nomeProd = nomeProd.toLowerCase().trim();
      this.produtosFiltrados = this.products.filter(p =>
        p.nomeProduto.toLowerCase().includes(nomeProd)
      );
    }
    this.currentPage = 0; // Reset para a primeira página ao filtrar
    this.updatePagedProdutos();
  }

  consultarPorID(id:number) {
    if (!id || id == null) {
      this.produtosFiltrados = this.products;
    } else {
      this.produtosFiltrados = this.products.filter(p =>
        p.idProduto.toString(id)
      );
    }
    this.currentPage = 0; // Reset para a primeira página ao filtrar
    this.updatePagedProdutos();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProdutos();
  }

  updatePagedProdutos() {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedProdutosFiltrados = this.produtosFiltrados.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  launchingPurchaseToShoppingCart(userName:string, productId: number) {
    if(userName == null || productId == null){
      console.info('Usuário ou produto nulo',  userName , productId)
    }
    var prodId:number[] =[];
    for (const id of [productId]) {
      prodId.push(...[id]);
      }
    this.purchaseState.startSaleOfSelectedProduct(userName, prodId);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }


  clearHighlight() {
    this.selectedProduct = null;
    this.purchaseState.clearSelectedProduct();
    this.highlightProductInList(-1); // Passa um ID inválido para remover todos os destaques
  }


}
