import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ProductService} from "../../services/product.service";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {MatDialog} from "@angular/material/dialog";
import { FormControl} from "@angular/forms";
import {iProduto} from "../../interfaces/product";
import { PageEvent} from "@angular/material/paginator";
import {registerLocaleData} from "@angular/common";
import ptBr from "@angular/common/locales/pt";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {PurchaseStateService} from "../../services/purchase-state.service";

registerLocaleData(ptBr);

@Component({
  selector: 'products-p',
  templateUrl: './products-p.html',
  styleUrls: ['./products-p.css'],
  providers:    [ { provide: LOCALE_ID, useValue: 'pt' }]
})

export class ProductsPComponent implements OnInit {
  spiner = false;
  pageSize = 20;
  currentPage = 0;
  produtosFiltrados: iProduto[] = [];
  pagedProdutosFiltrados: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  imageUrl: SafeUrl | undefined;

  constructor(private prodService: ProductService,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private router: Router,
              private purchaseState: PurchaseStateService
  ) {
  }

  ngOnInit(): void {
    this.listarProdutos();
   }


 listarProdutos(){
   this.spiner = true;
    this.prodService.getTodosProdutos()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar produto.')
        return of([])}))
      .subscribe(  (rest: iProduto[])=>  {
        this.products = rest;
        this.produtosFiltrados = rest;
        this.updatePagedProdutos();
        this.spiner = false;
      } );
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
    this.router.navigate(['/auth/login']);
  }

}
