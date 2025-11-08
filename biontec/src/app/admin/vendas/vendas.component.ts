import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {expand, of} from "rxjs";
import { catchError } from "rxjs/operators";
import { DialogItensVdComponent } from "src/app/shared/diolog_components/dialog-itensvd/dialog-itensvd.component";
import { iItensVd } from "../../interfaces/itens-vd";
import { iVendas } from "../../interfaces/vendas";
import { ItensVdService } from "../../services/itens-vd.service";
import { VendasService } from "../../services/vendas.service";
import { DialogOpenSalesComponent } from "../../shared/diolog_components/dialog-open-sales/dialog-open-sales.component";
import { ErrorDiologComponent } from "../../shared/diolog_components/error-diolog/error-diolog.component";


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
  tbSourceItensVd$: MatTableDataSource<iItensVd>;
  displayedColumns: string[] = ['codigo','descricao','preco','qtd','soma','data','imagem','opicoes'];

  vendaControl = new FormControl();
  produtControl = new FormControl();
  vendasFiltered: iVendas[]=[];
  vendas: iVendas[]=[];
  itensVdFiltered: iItensVd[]=[];
  itensVd: iItensVd[]=[];


  constructor(
              private vendasService: VendasService,
              public dialog: MatDialog,
              private itensDaVdService: ItensVdService
  ) {
    this.tbSourceVd$ = new MatTableDataSource();
    this.tbSourceItensVd$ = new MatTableDataSource();
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
        console.log('Vendas --',data)
      this.tbSourceVd$.data = data;
        for (const dataKey in data) {
          this.tbSourceItensVd$.data = data[dataKey].itensVd;
          console.log('Lista de Itens ->', this.tbSourceItensVd$.data);
        }
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

  toggleRow(element: any) {
    var soma = 0;
    for(var i =0;i<element.itensVd.length;i++){
      soma+=element.itensVd.map((p:iItensVd)=>p.valorParcial)[i];
    }
    this.tbSourceItensVd$.data = element.itensVd;
    console.log('ItensVD ',  this.tbSourceItensVd$.data , 'Soma ', soma);

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


  aplicarFiltro(valor: string) {
      valor = valor.trim().toLowerCase();
      this.tbSourceVd$.filter = valor;
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }


  openDilogItenVd(eventVd: iItensVd){
    console.log("Dados do elementoDialog", eventVd)
    const dialogRef = this.dialog.open(DialogItensVdComponent, {
      width: '300px',
      data: eventVd === null ? {
        idItensVd: null,
        codProduto: ' ' ,
        codVenda: ' ' ,
        descricao: ' ' ,
        dtRegistro: ' ' ,
        qtdVendidas: null,
        valCompra: null,
        valVenda: null,
        valorParcial: null,
      } : {
        idItensVd: eventVd.idItensVd ,
        codProduto: eventVd.codProduto ,
        codVenda: eventVd.codVenda ,
        descricao: eventVd.descricao ,
        dtRegistro: eventVd.dtRegistro ,
        qtdVendidas: eventVd.qtdVendidas ,
        valCompra: eventVd.valCompra ,
        valVenda: eventVd.valVenda ,
        valorParcial: eventVd.valorParcial ,
      }

    });

    console.log("Evento de dialogRef", dialogRef)

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

  openDilogVd(eventVd: iVendas) {
   // console.log("Evento do  Dialog de vendas-", eventVd)
    const dialogRef = this.dialog.open(DialogOpenSalesComponent, {
      width: '300px',
      data: eventVd === null ? {
        idVenda: null,
        dtVenda: '',
        nomeFuncionario: '',
        nomeCliente: '',
        subtotal: null,
        desconto: null,
        totalgeral: null,
        formasDePagamento: "",
        qtdDeParcelas:null,
      } : {
        idVenda: eventVd.idVenda,
        dtVenda: eventVd.dtVenda,
        nomeFuncionario: eventVd.nomeFuncionario,
        nomeCliente: eventVd.nomeCliente,
        dt_venda: eventVd.dtVenda,
        subtotal: eventVd.subtotal,
        desconto: eventVd.desconto,
        totalgeral: eventVd.totalgeral,
        formasDePagamento: eventVd.formasDePagamento,
        qtdDeParcelas:eventVd.qtdDeParcelas,

      }
    });
  }

}
