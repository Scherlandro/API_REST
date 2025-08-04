import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {IUser} from "../../interfaces/user";
import {DialogUsuarioComponent} from "../../shared/diolog_components/dialog-usuario/dialog-usuario.component";
import {MensagemService} from "../../services/mensagem.service";
import {Observable, of} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {iProduto} from "../../interfaces/product";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../services/product.service";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {MatDialog} from "@angular/material/dialog";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  events = new FormControl();
  mensagens!: Observable<string> ;
  spiner = false;
  @ViewChild(MatTable) tableProduto!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  cardProduts= new Observable<iProduto[]>;
  tbSourceProdutos$ = new MatTableDataSource<iProduto>();
  produtosFiltered: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  searchTerm !:any;
  imageUrl: SafeUrl | undefined;

  constructor(
              public notificationMsg:  NotificationMgsService,
              private prodService: ProductService,
              private cartService: ShoppingCartService,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer
              ) { }

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

  showNotification(){
    this.notificationMsg.openConfirmDialog('Hello')
      .afterClosed().subscribe(res =>{
      if (res){
        this.notificationMsg.openConfirmDialog("Beleza");
      }
    });
    // this.mensagens = this.mensagemService.getNotification();
    /*   this.mensagemService.getMensagens().subscribe((mensagem) => this.mensagens.push(mensagem)  );*/
  }


}
