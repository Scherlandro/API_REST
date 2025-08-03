import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ProductService} from "../../services/product.service";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {MatDialog} from "@angular/material/dialog";
import { FormControl} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {iProduto} from "../../interfaces/product";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {registerLocaleData} from "@angular/common";
import ptBr from "@angular/common/locales/pt";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

registerLocaleData(ptBr);

@Component({
  selector: 'products-p',
  templateUrl: './products-p.html',
  styleUrls: ['./products-p.css'],
  providers:    [ { provide: LOCALE_ID, useValue: 'pt' }]
})

export class ProductsPComponent implements OnInit {
  @ViewChild(MatTable) tableProduto!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  spiner = false;
  cardProduts= new Observable<iProduto[]>;
  tbSourceProdutos$ = new MatTableDataSource<iProduto>();
  produtosFiltered: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  searchTerm !:any;
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
        this.tbSourceProdutos$.data = rest;
        this.spiner = false;
     /*  this.tbSourceProdutos$.paginator = this.paginator;*/
      } );
  }
  getImageUrl(fotoProduto: string): SafeUrl {
    if (!fotoProduto) return '';
    const objectURL = 'data:image/jpeg;base64,' + fotoProduto;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  consultarPorCod(codProd: string){
    if (this.produtoControl.valid) {
      this.prodService.getProdutoPorCod(codProd)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar produto.')
          return of([]) })).subscribe((result:iProduto[]) => {
      this.tbSourceProdutos$.data = result;
          console.log("Retorno da MatTableDat ", result )
    } )
    }
  }

  consultarPorNome(nomeProd: string){
    if (this.produtoControl.valid) {
      this.prodService.listarProdutoPorNome(nomeProd)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar produto.')
          return of([]) }))
        .subscribe((result:iProduto[]) => {
          this.aplicarFiltro(nomeProd);
          this.tbSourceProdutos$.data = result;
          console.log(result)
        } )
    }
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceProdutos$.filter = valor;
  }

  loginAndAddProd(){
  //  this.router.navigate(['/auth/login']);
  }

  changeProdutos(value: any){
    if (value) {
      this.produtosFiltered = this.products.filter(products => products.idProduto.toString()
        .includes(value.toUpperCase()));
    } else {
      this.produtosFiltered = this.products;
    }
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.cartService.search.next(this.searchTerm);
  }

 /* onSubmit(valor: string) {
     this.prodService.search(valor).subscribe(
      (result:iProduto[]) => {  this.tbSourceProdutos$.data = result }
    );
    this.prodService.getTodosProdutos().pipe(
      map((options) => (options.length == 0 ? true : false))
    );
   this.router.navigate(['/search-results-list']);
   valor.resetForm();
  }*/



}
