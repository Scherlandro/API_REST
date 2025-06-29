import { Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {of} from 'rxjs';
import {catchError} from "rxjs/operators";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {iProduto} from "../../interfaces/product";
import {DialogProdutoComponent} from "../../shared/diolog_components/dialog-produto/dialog-produto.component";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {ProductService} from "../../services/product.service";
import {registerLocaleData} from "@angular/common";
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-products-public',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
   providers:    [ { provide: LOCALE_ID, useValue: 'pt' },
    ],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatTable) tableProduto!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  displayedColumns: string[] = ['cod_produto', 'descricao'
    , 'valor_venda', 'quantidade_estoque', 'dt_cadastro', 'imagem', 'opicoes'];
  tbSourceProdutos$ = new MatTableDataSource<iProduto>();
  produtosFiltered: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl = new FormControl();
  searchTerm !: string;

  constructor(private prodService: ProductService,
              /* private cartService: ShoppingCartService,*/
              public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos() {
    this.prodService.getTodosProdutos()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar produto.')
        return of([])
      }))
      .subscribe((rest: iProduto[]) => {
        this.tbSourceProdutos$.data = rest;
        this.tbSourceProdutos$.paginator = this.paginator;
      });
  }

  consultarPorCod(codProd: string) {
    if (this.produtoControl.valid) {
      this.prodService.getProdutoPorCod(codProd)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar produto.')
          return of([])
        })).subscribe((result: iProduto[]) => {
        this.tbSourceProdutos$.data = result;
        console.log("Retorno da MatTableDat ", result)
      })
    }
  }

  consultarPorNome(nomeProd: string) {
    if (this.produtoControl.valid) {
      this.prodService.listarProdutoPorNome(nomeProd)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar produto.')
          return of([])
        }))
        .subscribe((result: iProduto[]) => {
          this.aplicarFiltro(nomeProd);
          this.tbSourceProdutos$.data = result;
        })
    }
  }

  changeProdutos(value: any) {
    if (value) {
      this.produtosFiltered = this.products.filter(
        p => p.idProduto.toString()
          .includes(value.toUpperCase()));
    } else {
      this.produtosFiltered = this.products;
    }
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceProdutos$.filter = valor;
  }

  openDialogo(eventProd: iProduto) {
    console.log("Dados do elementoDialog", eventProd)
    const dialogRef = this.dialog.open(DialogProdutoComponent, {
      width: '300px',
      data: eventProd === null ? {
        id_produto: null,
        cod_produto: '',
        nome_produto: '',
        valor_compra: '',
        percentual: '',
        valor_venda: '',
        quantidade_estoque: '',
        dt_cadastro: ''
      } : {
        id_produto: eventProd.idProduto,
        cod_produto: eventProd.codProduto,
        nome_produto: eventProd.nomeProduto,
        valor_compra: eventProd.valorCompra,
        percentual: eventProd.percentual,
        valor_venda: eventProd.valorVenda,
        quantidade_estoque: eventProd.qtdEstoque,
        dt_cadastro: eventProd.dtCadastro
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
    });
  }

  editarElement(eventProd: iProduto) {
    this.openDialogo(eventProd);
  }

  deleteElement(id: number) {
    if (confirm('Tem certeza em REMOVER este item ?')) {
      this.prodService.delete(id)
        .subscribe(data => {
          this.tbSourceProdutos$.data.pop();
          this.tableProduto.renderRows();
          this.tbSourceProdutos$.data = this.produtosFiltered.filter(
            p => p.idProduto !== data.idProduto);//.renderRows();
        });
    }
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  onMatSortChange() {
    this.tbSourceProdutos$.sort = this.sort;
  }

  mostrarLinhaClicada(row: any) {
    console.log('Linha clicada -->: ', row);
  }


  /*
    buscarPorNome(valor:string){
      if(valor !== '') {
        this.prodService.searchByName(valor).subscribe(
          (rest: IProduto[]) => {
            this.tbSourceProdutos$.data = rest;
            // this.tbSourceProdutos$.paginator = this.paginator;
          });
      }
    }*/


  /*
  removerLinha(index: number){
    console.log(index);
    this.tbSourceProdutosL$.splice(index,1);
    this.tbSourceProdutosL$.length.toString(1);
    }

    search(event:any){
      this.searchTerm = (event.target as HTMLInputElement).value;
      console.log(this.searchTerm);
      this.cartService.search.next(this.searchTerm);
    }

    buscar(){
      if(this.produtoControl.value == ""){
        this.ngOnInit();
      }else{
        this.tbSourceProdutos$.data = this.produtosFiltered.filter(
          res => {  return res.nome_produto.toLocaleLowerCase()
              .match(this.produtoControl.value.toLocaleLowerCase());
          } ) }
    }

    ...   implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    this.tbSourceProdutos$.sort = this.sort;
  }


  */


}

