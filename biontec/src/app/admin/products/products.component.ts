import { registerLocaleData } from "@angular/common";
import ptBr from '@angular/common/locales/pt';
import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { of } from 'rxjs';
import { catchError } from "rxjs/operators";
import { iProduto } from "../../interfaces/product";
import { ProductService } from "../../services/product.service";
import { DialogProdutoComponent } from "../../shared/diolog_components/dialog-produto/dialog-produto.component";
import { ErrorDiologComponent } from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ShoppingCartService} from "../../services/shopping-cart.service";

registerLocaleData(ptBr);

@Component({
  selector: 'app-products-public',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
   providers:    [ { provide: LOCALE_ID, useValue: 'pt' },
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

  constructor(private prodService: ProductService,
              private cartService: ShoppingCartService,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer
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

  openDialogo(eventProd: iProduto) {
    console.log("Dados do elementoDialog", eventProd)
    const dialogRef = this.dialog.open(DialogProdutoComponent, {
      width: '300px',
      data: eventProd === null ? {
        idProduto: null,
        codProduto: '',
        nomeProduto: '',
        valorCompra: '',
        percentual: '',
        valorVenda: '',
        qtdEstoque: '',
        dtCadastro: ''
      } : {
        idProduto: eventProd.idProduto,
        codProduto: eventProd.codProduto,
        nomeProduto: eventProd.nomeProduto,
        valorCompra: eventProd.valorCompra,
        percentual: eventProd.percentual,
        valorVenda: eventProd.valorVenda,
        qtdEstoque: eventProd.qtdEstoque,
        dtCadastro: eventProd.dtCadastro
      }
    });


   /* dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.tbSourceProdutos$.data
          .map(p => p.idProduto).includes(result.idProduto)) {
          this.prodService.editElement(result)
            .subscribe((data: iProduto) => {
              const index = this.tbSourceProdutos$.data
                .findIndex(p => p.idProduto === data.idProduto);
              this.tbSourceProdutos$.data[index] = data;
              this.tableProduto.renderRows();
            });
        } else {
          this.prodService.createElements(result)
            .subscribe((data: iProduto) => {
              this.tbSourceProdutos$.data.push(result);
              this.tableProduto.renderRows();
            });
        }
      }
    });*/
  }

  editarElement(eventProd: iProduto) {
    this.openDialogo(eventProd);
  }

  deleteElement(id: number) {
    if (confirm('Tem certeza em REMOVER este item ?')) {
      this.prodService.delete(id)
        .subscribe(data => {
       //   this.tbSourceProdutos$.data.pop();
       //   this.tableProduto.renderRows();
         this.produtosFiltrados = this.products.filter(
            p => p.idProduto !== data.idProduto);//.renderRows();
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

