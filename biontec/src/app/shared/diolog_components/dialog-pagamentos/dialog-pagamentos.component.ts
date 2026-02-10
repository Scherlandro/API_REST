import {Component, Inject, Input, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {PagamentoService} from "../../../services/pagmentos.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {iPagamento} from "../../../interfaces/pagamento";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TokenService} from "../../../services/token.service";
import {NotificationMgsService} from "../../../services/notification-mgs.service";
import {catchError, startWith} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";



@Component({
  selector: 'app-dialog-pagamentos',
  templateUrl: './dialog-pagamentos.component.html',
  styleUrls: ['./dialog-pagamentos.component.css']
})
export class DialogPagamentosComponent {
  destroy$ = new Subject<void>();
  @ViewChild(MatTable) tablePagamento!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['Data', 'forma', 'valor', 'opicoes'];
  tbSourcePagamentos$: MatTableDataSource<iPagamento>;
  tbData: any;
  PagamentoControl = new FormControl();
  PagamentoFilted: iPagamento[] = [];
  buscaDigitada: any;
  ruwSelec: any;
  pagamento!: iPagamento;
  @Input() origemId!: number;
  @Input() tipoOrigem: string = 'VENDA';

  pagamentos: iPagamento[] = [];
  statusFiltradPg!: Observable<any>;
  statusPgControl = new FormControl('', [Validators.required]);


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: iPagamento,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPagamentosComponent>,
    public pagamentoService: PagamentoService,
    private tokenServer: TokenService,
    public notificationMsg: NotificationMgsService,
    private PagamentoSevice: PagamentoService
  ) {
    this.pagamento = data;
    this.tbSourcePagamentos$ = new MatTableDataSource();
    console.log('Venda para Pagar', this.pagamento);
  }


  ngOnInit(): void {
   // this.carregarPagamentos();
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

  // =============== AUTOCOMPLETE ==================
  // ===============================================

  setupAutocompleteFilters() {
 /*   this.formasPgFilted = this.formasControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.pagamentoService.getFormasDePagamento(value)
          : of([])
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    );

  */

    this.statusFiltradPg = this.statusPgControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(value => { const busca = typeof value === 'string' ? value : '';
        return this.pagamentoService.getStatus(busca);
      }),
      takeUntil(this.destroy$)
    );
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


  editarElement(element: any) {

  }

  deleteElement(id_Pagamento: any) {

  }


  selectRow(row: any) {
    this.ruwSelec = this.tbSourcePagamentos$.filteredData.indexOf(row);
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  displayStatus(status: string): string {
    return status ? status : '';
  }

}
