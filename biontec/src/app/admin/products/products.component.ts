import {registerLocaleData} from "@angular/common";
import ptBr from '@angular/common/locales/pt';
import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import { PageEvent} from "@angular/material/paginator";
import {of} from 'rxjs';
import {catchError} from "rxjs/operators";
import {iProduto} from "../../interfaces/product";
import {ProductService} from "../../services/product.service";
import {DialogProdutoComponent} from "../../shared/dialogs/dialog-produto/dialog-produto.component";
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {PurchaseStateService} from "../../services/purchase-state.service";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";

registerLocaleData(ptBr);

@Component({
  selector: 'app-products-public',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'pt'},
  ],
})
export class ProductsComponent implements OnInit {
  spiner = false;
  pageSize = 20;
  currentPage = 0;
  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  imageUrl: SafeUrl | undefined;
  cleanInput: any;

  constructor(
    private tokenServer: TokenService,
    private prodService: ProductService,
    private cartService: PurchaseStateService,
    public dialog: MatDialog,
    public notificationMsg: NotificationMgsService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.listarProdutos();
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


  consultarPorCod(codProd: string) {
    if (this.produtoControl.valid) {
      this.prodService.getProdutoPorCod(codProd)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar produto.')
          return of([])
        })).subscribe((rest: iProduto[]) => {
        this.products = rest;
        this.produtosFiltrados = rest;
      })
    }
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

  changeProdutos(value: any) {
    if (value) {
      this.produtosFiltrados = this.products.filter(
        p => p.idProduto.toString()
          .includes(value.toUpperCase()));
    } else {
      this.produtosFiltrados = this.products;
    }
  }

  editarElement(eventProd: iProduto) {
    this.produtoControl.setValue('');
    this.consultarPorNome('');
    this.openDialogo(eventProd);
  }

  openDialogo(eventProd: iProduto) {
   const dialogRef = this.dialog.open(DialogProdutoComponent, {
      width: '500px',
      data: {...eventProd ?? {}}
    });

    dialogRef.afterClosed().subscribe(refDialog => {
      if (refDialog) {
        //Recarrega os dados para garantir que temos a lista de produtos atualizada do banco
        this.prodService.getTodosProdutos().pipe(catchError(error => {
          if (error === 'Session Expired') this.onError('Sua sessão expirou!');
          this.tokenServer.clearTokenExpired();
          return of([])
        })).subscribe(prodAtulizado => {
          this.products = prodAtulizado;
          this.produtosFiltrados = prodAtulizado;
          this.updatePagedProdutos();
          // Localiza o produto que foi alterada (usando o idProduto ou codProd retornado)
          const idProdAlterado = refDialog.idProduto || refDialog.codProduto;
          const produtoNoArray = this.pagedProdutosFiltrados.find(v => v.idProduto === idProdAlterado);
          if (produtoNoArray) {
            this.prodService.editElement(produtoNoArray).subscribe({
              next: () => {
                this.notificationMsg.success('Produto atualizado no servidor!');
              },
              error: () => this.onError('Erro ao atualizar produto.')
            });
          }
        });
      }
    });


  }

  deleteElement(id: number) {
    if (confirm('Tem certeza em REMOVER este item ?')) {
      this.prodService.delete(id).subscribe({
        next: () => {
          // Remova o item da lista original (products)
          this.products = this.products.filter(p => p.idProduto !== id);
          // Remova o item da lista filtrada (exibida na tela)
          this.produtosFiltrados = this.produtosFiltrados.filter(p => p.idProduto !== id);
          // Atualize a paginação para o usuário ver a mudança imediatamente
          this.updatePagedProdutos();
          console.log(`Produto ${id} removido com sucesso.`);
        },
        error: (err) => {
          this.onError('Erro ao deletar o produto. Verifique se ele ainda existe.');
          console.error(err);
        }
      });
    }
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

  mostrarLinhaClicada(row: any) {
    console.log('Linha clicada -->: ', row);
  }


}

