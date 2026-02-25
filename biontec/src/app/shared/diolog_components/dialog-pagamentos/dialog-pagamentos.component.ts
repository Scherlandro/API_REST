import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {DialogParcelamentosComponent} from "../dialog-parcelamentos/dialog-parcelamentos.component";
import {EfiChargeRequest} from "../../../interfaces/efi-charge-request";
import {DialogPixComponent} from "../dialog-pix/dialog-pix.component";


@Component({
  selector: 'app-dialog-pagamentos',
  templateUrl: './dialog-pagamentos.component.html',
  styleUrls: ['./dialog-pagamentos.component.css']
})
export class DialogPagamentosComponent implements OnInit, OnDestroy{
  destroy$ = new Subject<void>();
  @ViewChild('tablePg') tablePagamento!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['origemId', 'tipoOrigem', 'formaPagamento', 'status','valor', 'opicoes'];
  tbSourcePagamentos$: MatTableDataSource<iPagamento>;
  tbData: any;
  formaPagamentoControl= new FormControl();
  PagamentoControl = new FormControl();
  PagamentoFilted: iPagamento[] = [];
  buscaDigitada: any;
  ruwSelec: any;
  pagamento!: iPagamento;
  pagamentos: iPagamento[] = [];
  statusFiltradPg!: Observable<any>;
  statusPgControl = new FormControl('', [Validators.required]);
  formaDePgFiltrad!: Observable<any>;
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: iPagamento,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPagamentosComponent>,
    public pagamentoService: PagamentoService,
    private tokenServer: TokenService,
    public notificationMsg: NotificationMgsService
  ) {
    this.pagamento = data;
    this.tbSourcePagamentos$ = new MatTableDataSource();
    console.log('Venda para Pagar', this.pagamento);
  }


  ngOnInit(): void {
   // this.carregarPagamentos();
    // this.listarPagamentos(origemId: number, tipoOrigem: string);
   this.setupAutocompleteFilters();
  }

  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.complete();
  }

  carregarPagamentos() {
    this.pagamentoService.buscarPorOrigem(this.data.origemId, this.data.tipoOrigem)
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
  this.formaDePgFiltrad = this.formaPagamentoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
     /* switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.pagamentoService.getFormasPagamento(value)
          : of([])
      ),*/
      switchMap(value => { const busca = typeof value === 'string' ? value : '';
        return this.pagamentoService.getFormasPagamento(busca);
      }),
     // catchError(() => of([])),
      takeUntil(this.destroy$)
    );

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

  confirmarPagamentoEfi(forma: string) {
    const payload: EfiChargeRequest = {
      idPagamento: this.pagamento.idPagamento | undefined,
      valor: this.pagamento.valorPago,
      pagador: {
        nome: "Cliente Exemplo", // Ideal  form ou objeto Cliente
        cpf: "12345678909"
      },
      tipoPagamento: forma === 'Pix' ? 'pix' : 'boleto'
    };

    this.pagamentoService.gerarCobrancaEfiViaPix(payload).subscribe({
      next: (res) => {
        if (forma === 'Pix') {
          // Efí retorna o QR Code em base64 e a cópia e cola
         // this.abrirModalQRCode(res.qrcode, res.copiaECola);
          this.abrirModalPix(res.qrcode);
        } else if (forma === 'Boleto') {
          // Efí retorna o link do PDF do boleto
          window.open(res.linkBoleto, '_blank');
        }
        this.listarPagamentos(this.data.origemId, this.data.tipoOrigem);
      },
      error: (err) => this.notificationMsg.sendError("Erro ao gerar cobrança na Efí")
    });
  }


onFormaPagamentoSelect(event: MatAutocompleteSelectedEvent) {
  const formaSelecionada = event.option.value;

  if (formaSelecionada === 'Pix' || formaSelecionada === 'Boleto') {
    this.notificationMsg.openConfirmDialog(`Deseja gerar um ${formaSelecionada} no valor de R$ ${this.pagamento.valorPago}?`)
      .afterClosed().subscribe(confirmado => {
      if (confirmado) this.confirmarPagamentoEfi(formaSelecionada);
    });
  }

  if (formaSelecionada === 'Cartão em Crédito') {
    // Atualiza o status automaticamente para 'Parcelada'
    this.statusPgControl.setValue('Parcelada');
    const valorVenda = this.pagamento.valorPago;
    this.gerarParcelas(valorVenda);
  }
  if(formaSelecionada === 'Dinheiro' || formaSelecionada === 'Pix' || formaSelecionada === 'Cartão em Débito'){
    this.statusPgControl.setValue('Fechada');
    const valorVenda = this.pagamento.valorPago;
    this.notificationMsg.openConfirmDialog( 'Confirma o pagamento de  '+ valorVenda +' em forma de  '+formaSelecionada );
  }
}

  gerarParcelas(valor: any) {
    const dialogRef = this.dialog.open(DialogParcelamentosComponent, {
      data: valor,
      width: '500px',
      disableClose: true // Impede fechar clicando fora, forçando o uso dos botões
    });

    dialogRef.afterClosed().subscribe((parcelasGeradas: any[]) => {
      if (parcelasGeradas) {
        console.log('Parcelas recebidas do modal:', parcelasGeradas);
        // para enviar junto com o formulário final da venda
       // this.listaDeParcelasFinal = parcelasGeradas;
        this.notificationMsg.success(`${parcelasGeradas.length} parcelas geradas com sucesso!`);
      }
    });
  }

  abrirModalPix(dadosPix: any) {
    this.dialog.open(DialogPixComponent, {
      data: dadosPix,
      width: '350px'
    }).afterClosed().subscribe(() => {
      // Após fechar, atualiza a lista para ver se o status mudou via Webhook
      this.listarPagamentos(this.data.origemId, this.data.tipoOrigem);
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

    this.pagamentoService.buscarPorOrigem(origemId, tipoOrigem)
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

  displayFormasDePg(status: string): string {
    return status ? status : '';
  }

  displayStatus(status: string): string {
    return status ? status : '';
  }

  onCancel() {
    this.voltar();
    this.dialogRef.close();
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }

}
