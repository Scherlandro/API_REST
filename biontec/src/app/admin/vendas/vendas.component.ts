import {Component, OnInit, ViewChild} from '@angular/core';
import {iVendas} from "../../interfaces/vendas";
import {VendasService} from "../../services/vendas.service";
import {iItensVd} from "../../interfaces/itens-vd";
import {ItensVdService} from "../../services/itens-vd.service";
import {FormArray, FormControl, NgForm, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {DialogProdutoComponent} from "../../shared/diolog_components/dialog-produto/dialog-produto.component";
import {DialogOpenSalesComponent} from "../../shared/diolog_components/dialog-open-sales/dialog-open-sales.component";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";


@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VendaComponent implements OnInit {

  @ViewChild(MatTable) tableVendas!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  displayedColumnsVd: string[] = ['nome_cliente','dt_venda','total_geral','opicao'];
  tbSourceVd$: MatTableDataSource<iVendas>;
  displayedColumns: string[] = ['codigo','descricao','preco','qtd','soma','data','imagem','opicoes'];
 // tbSourceItensDaVd$ :MatTableDataSource<iItensVd>;
  tbSourceItensDaVd$ :any;

  vendaControl = new FormControl();
  produtControl = new FormControl();
  //listaItensVd: iItensVd[]=[];
  vendasFiltered: iVendas[]=[];
  vendas: iVendas[]=[];
  itensVdFiltered: iItensVd[]=[];

  constructor(
              private vendasService: VendasService,
              public dialog: MatDialog,
              private itensDaVdService: ItensVdService
  ) {
    this.tbSourceVd$ = new MatTableDataSource();
    this.tbSourceItensDaVd$ = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarVenda();
   }


  listarVenda() {
    this.vendasService.getAllSales()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar Vendas!')
        return of([])
      }))
      .subscribe((data: iVendas[]) => {
      this.tbSourceVd$.data = data;
      this.tbSourceVd$.paginator = this.paginator;
    });
  }

  consultarPorCliente(nome: string) {
    if (this.vendaControl.valid) {
      this.vendasService.listarVdPorCliente(nome)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar Cliente!')
          return of([])
        }))
        .subscribe((result: iVendas[]) => {
          this.aplicarFiltro(nome);
          this.tbSourceVd$.data = result;
        })
    }
  }

  toggleRow(element: iVendas) {
    console.log('ID da venda selecionada ==> ', element.idVenda.toString());
    this.itensDaVdService.listarItensVdPorCodVenda(element.idVenda.toString())
      .pipe(catchError(error => {
        this.onError('Erro ao buscar Itens da Venda!')
        return of([])
      }))
      .subscribe((data: iItensVd[]) => {
        console.log('ItensVD ==> ', data);
        this.tbSourceItensDaVd$.data = data;
        var soma = 0;
        for(var i =0;i<data.length;i++){
          soma+=data.map(i=>i.valor_parcial)[i];
        }
        console.log('ItensVD somados', soma);
      });
  }

  listarItensVdEntreDatas(){
      this.itensDaVdService.getItensVdEntreDatas('06/04/2020', '13/04/2020')
        .subscribe(   (data: iItensVd[]) => {
       // this.tbSourceItensDaVd$ = data;
      });
    }

    listarItensPorCodVenda(){
      this.itensDaVdService.listarItensVdPorCodVenda('1')
        .subscribe(   (data: iItensVd[]) => {
       // this.tbSourceItensDaVd$.data = data;
        console.log('Itens por Cod de venda-->', data);
      });
    }

  changeSales(value: any){
    if (value) {
      this.vendasFiltered = this.vendas.filter(
        vd => vd.nomeCliente.toString()
        .includes(value.toUpperCase()));
    } else {
      this.vendasFiltered = this.vendas;
    }
  }
/*  changeItensVd(value: any){
    if (value) {
      this.itensVdFiltered = this.itensVdFiltered.filter(
        i => i.descricao.toString()
        .includes(value.toUpperCase()));
    } else {
      this.itensVdFiltered = this.itensVdFiltered;
    }
  }*/

  aplicarFiltro(valor: string) {
      valor = valor.trim().toLowerCase();
      this.tbSourceVd$.filter = valor;
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }


  openDilogItenVd(eventVd: any){
   // console.log("Dados do elementoDialog", eventVd)
    const dialogRef = this.dialog.open(DialogProdutoComponent, {
      width: '300px',
      data: eventVd === null ? {
        cod_vendas: null,
        descricao: '',
        valor_venda: '',
        qtd_vendidas: ''
      } : {
        cod_vendas: eventVd.cod_vendas,
        descricao: eventVd.descricao,
        valor_venda: eventVd.valor_venda,
        qtd_vendidas: eventVd.qtd_vendidas,

      }
    });

  /*  dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.tbSourceItensDaVd$.data
          .map(p => p.id).includes(result.id)) {
          this.itensDaVdService.getItensVdEntreDatas(result)
            .subscribe((data: IProduto) => {
              const index = this.tbSourceItensDaVd$.data
                .findIndex(p => p.id === data.id_produto);
              this.tbSourceItensDaVd$.data[index] = data;
              this.tableVendas.renderRows();
            });
        } else {
          this.itensDaVdService.createVd(result)
            .subscribe((data: IProduto) => {
              this.tbSourceItensDaVd$.data.push(result);
              this.tableVendas.renderRows();
            });
        }
      }
    });*/
  }

  openDilogVd(eventVd: any) {
   // console.log("Evento do  Dialog de vendas-", eventVd)
    const dialogRef = this.dialog.open(DialogOpenSalesComponent, {
      width: '300px',
      data: eventVd === null ? {
        idVenda: null,
        nomeCliente: '',
        dtVenda: '',
        cod_vendas: null,
        descricao: '',
        valor_venda: '',
        qtd_vendidas: ''
      } : {
        idVenda: eventVd.idVenda,
        nomeCliente: eventVd.nomeCliente,
        dtVenda: eventVd.dtVenda,
        cod_vendas: eventVd.cod_vendas,
        descricao: eventVd.descricao,
        valor_venda: eventVd.valor_venda,
        qtd_vendidas: eventVd.qtd_vendidas,

      }
    });
  }

  /*
  https://stackoverflow.com/questions/69717559/how-to-generate-and-display-nested-angular-material-table-dynamically
  https://stackblitz.com/angular/eaajjobynjkl?file=src%2Fapp%2Ftable-expandable-rows-example.html

 listarItens(d:iVendas[], n:any){
    d.map(a=>a.itensVd).forEach((e, i) => {  this.tbSourceItensDaVd$[i] = e   });
         this.listaItensVd.forEach((a) => this.tbSourceItensDaVd$ = d.map(i=>i.itensVd).at(n) );
          this.tbSourceItensDaVd$ = d.map(i=>i.itensVd).at(n);
          this.tbSourceItensDaVd$ = this.listaItensVd.at(n);
          this.tbSourceItensDaVd$ = this.listaItensVd.reduce((d:iItensVd) => {  return  d  });
   for ( this.tbSourceItensDaVd$.data = its[n];   d.length < n   ; d[n] ) {  n ++  }

  }

  trash(id:number | undefined){
      this.vendasService.trashSales(id).subscribe(
        data => {   console.log(data)     this.ngOnInit()   })
    }

    untrash(id:number | undefined){
      this.vendasService.untrashSales(id).subscribe(
        data => {     console.log(data)    this.ngOnInit()   })
    }

  -------------------------------------
  export interface Cart {
     id: number,
     userId: number,
     date: string,
     products: Array<{productId: number, quantity: number}>,
     __v: number
 }
 -------------------------------------------------
   carts!: Cart[];
   displayedColumns: string[] = ['id','userId', 'date',  'products-id', 'products-quantity'];

   constructor(
     private cartsService: CartsService,
     private route: ActivatedRoute
   ) { }

   ngOnInit(): void {
     this.route.params.subscribe(response => this.cartsService.getCart(response.id)
     .subscribe(response => this.carts = response)
     );
   }

   toggleRow(element: { expanded: boolean; }) {
   // Uncommnet to open only single row at once
    ELEMENT_DATA.forEach(row => {
      row.expanded = false;
    })
    element.expanded = !element.expanded
  }


   */


}
