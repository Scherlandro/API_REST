import {Component, Inject, Input, ViewChild} from '@angular/core';
import {PagamentoService} from "../../../services/pagmentos.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {iVendas} from "../../../interfaces/vendas";
import {iPagamento} from "../../../interfaces/pagamento";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TokenService} from "../../../services/token.service";
import {NotificationMgsService} from "../../../services/notification-mgs.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";

class FormControl {
}

@Component({
  selector: 'app-dialog-pagamentos',
  templateUrl: './dialog-pagamentos.component.html',
  styleUrls: ['./dialog-pagamentos.component.css']
})
export class DialogPagamentosComponent {

  @ViewChild(MatTable) tablePagamento!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['Data', 'forma', 'valor', 'opicoes'];
  tbSourcePagamentos$: MatTableDataSource<iPagamento>;
  tbData:any;
  PagamentoControl = new FormControl();
  PagamentoFilted: iPagamento[] = [];
  buscaDigitada: any;
  ruwSelec: any;
  venda: any;
  @Input() origemId!: number;
  @Input() tipoOrigem: string = 'VENDA';

  pagamentos: iPagamento[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: iVendas,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPagamentosComponent>,
    public pagamentoService: PagamentoService,
    private tokenServer: TokenService,
    public notificationMsg:  NotificationMgsService,
    private PagamentoSevice: PagamentoService
  ) {
    this.venda = data;
    this.tbSourcePagamentos$ = new MatTableDataSource();
  }


  ngOnInit(): void {
    this.carregarPagamentos();
     // this.listarPagamentos(origemId: number, tipoOrigem: string);
  }

  carregarPagamentos() {
    this.pagamentoService.buscarPorOrigem(this.origemId, this.tipoOrigem)
      .subscribe(dados => this.pagamentos = dados);
  }

  getLabelStatus(status: number) {
    const labels = ['Pendente', 'Confirmado', 'Cancelado'];
    return labels[status] || 'Desconhecido';
  }

  estornar(idPagamento: any) {

  }


pagar(val: any) {
  this.pagamentoService.salvar(val).subscribe(res => {
    console.log('Pagamento vinculado com sucesso!');
  });
}


  onMatSortChange() {
    this.tbSourcePagamentos$.sort = this.sort;
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourcePagamentos$.filter = valor;
  }


  listarPagamentos(origemId: number, tipoOrigem: string) {

    this.PagamentoSevice.buscarPorOrigem(origemId, tipoOrigem)
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          //this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: iPagamento[]) => {
        this.tbSourcePagamentos$.data = result;
        this.tbSourcePagamentos$.paginator = this.paginator;
      });
  }


  editarElement(element:any) {

  }

  deleteElement(id_Pagamento: any) {

  }


  selectRow(row:any){
    this.ruwSelec = this.tbSourcePagamentos$.filteredData.indexOf(row);
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

}
