import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {IUser} from "../../interfaces/user";
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


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  events = new FormControl();
  selectedProduct: iProduto | null = null; // Alterado para armazenar o produto completo
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
    private router: Router,
    public notificationMsg: NotificationMgsService,
    private prodService: ProductService,
    private purchaseState: PurchaseStateService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.listarProdutos();
   // const productId = localStorage.getItem('selectedProductId');

    this.purchaseState.getSelectedProduct().subscribe(productId => {
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  loadProductDetails(productId: number) {
    this.prodService.getIdProduto(productId).subscribe({
      next: (response) => {
        // Assumindo que a API retorna o produto diretamente ou em response.body
        this.selectedProduct = response.body || response;

        // Opcional: destacar o produto na lista
        if (this.selectedProduct) {
          // Destaca o produto na lista
          this.highlightProductInList(this.selectedProduct.idProduto);

          // Rolagem automática para o produto destacado (opcional)
          setTimeout(() => {
            const element = document.querySelector('.highlighted');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
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

  preparePurchase(productId: number) {
    this.purchaseState.setSelectedProduct(productId);
    this.router.navigate(['/admin/carrinho-de-compras']);
  }


  clearHighlight() {
    this.selectedProduct = null;
    this.purchaseState.clearSelectedProduct();
    this.highlightProductInList(-1); // Passa um ID inválido para remover todos os destaques
  }

}
