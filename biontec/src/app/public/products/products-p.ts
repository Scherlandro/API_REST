import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import { of} from 'rxjs';
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
  displayedColumns: string[] = ['descricao','preco',
    'qtd','imagem','opicoes'];
  tbSourceProdutos$ = new MatTableDataSource<iProduto>();
  produtosFiltered: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  searchTerm !:any;
 /*  string;@ViewChild('imgMain') imgMain!: ElementRef;
  imgWidth:any=0;
  imgHeight:any=0;*/

  constructor(private prodService: ProductService,
              private cartService: ShoppingCartService,
              public dialog: MatDialog
              ) {
  }

  ngOnInit(): void {
    this.listarProdutos();
   }
/*  onImageLoad(e: any){

    this.imgWidth=(this.imgMain.nativeElement as HTMLImageElement ).width;
    this.imgHeight=(this.imgMain.nativeElement as HTMLImageElement).height;

  }*/

  listarProdutos(){
    this.prodService.getTodosProdutos()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar produto.')
        return of([])}))
      .subscribe(  (rest: iProduto[])=>  {
        this.tbSourceProdutos$.data = rest;
        this.tbSourceProdutos$.paginator = this.paginator;
        // this.produtosFiltered = res;
      } );
  }

  consultarPorCod(codProd: string){
   // event.preventDefault();
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
    valor = valor.trim().toLowerCase(); // Remove espaços em branco
    //valor = valor.toLowerCase(); // MatTableDataSource padrão para lowercase
    this.tbSourceProdutos$.filter = valor;
  }

  loginAndAddProd(){
  //  this.router.navigate(['/auth/login']);
  }

  changeProdutos(value: any){
    if (value) {
      // https://www.youtube.com/watch?v=ZhcYPXLGr_E
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

  onSubmit(valor: string) {
     this.prodService.search(valor).subscribe(
      (result:iProduto[]) => {  this.tbSourceProdutos$.data = result }
    );
   //  this.prodService.getTodosProdutos().pipe(
   //   map((options) => (options.length == 0 ? true : false))
  //  );
   // this.router.navigate(['/search-results-list']);
    //valor.resetForm();
  }





}
/*
https://youtu.be/aPU1YawBWN8
https://youtu.be/jcpS5d4yz2w
 */


/*
   addProductCart(product: ProdutoModel_T): void {
    this.cartService.addProduct();
  }

  onSearch() {
    const fields = 'name,description,version,homepage';
    let value = this.produtoControl.value;
    if (value && (value = value.trim()) !== '') {
    const params_ = {
        search: value,
        fields: fields
      };
      let params = this.prodService.getProdutoPorCod(value.toString());
      params = params;
      params = params;
      this.tbSourceProdutos$ = this.prodService.getProdutoPorCod(value.toString())
        .pipe(
          tap((res: any) => (this.total = res.total)),
          map((res: any) => res.results)
        );
      console.log('Valor cod Produto ->', this.tbSourceProdutos$);

}
}

 */
/*
  ngOnInit(): void {
    this.tbSourceProdutos$ = this.queryField.valueChanges
      .pipe(
        map(value => value.trim()),
        filter(value => value.length > 1),
        debounceTime(200),
        distinctUntilChanged(),
        tap(value => console.log(value)),
        switchMap((value:string) => this.prodService.getProdutoPorCod(value.toString())) ,
        tap((res: any) => this.total = res.total),
        map((res: any) => res.results)
  );
}
 */
