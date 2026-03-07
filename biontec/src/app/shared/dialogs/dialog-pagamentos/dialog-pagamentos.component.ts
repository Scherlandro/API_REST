import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Observable, Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from "rxjs";
import { catchError, startWith } from "rxjs/operators";
import { iPagamento } from "../../../interfaces/pagamento";
import { NotificationMgsService } from "../../../services/notification-mgs.service";
import { PagamentoService } from "../../../services/pagmentos.service";
import { TokenService } from "../../../services/token.service";
import { ErrorDiologComponent } from "../error-diolog/error-diolog.component";

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DialogParcelamentosComponent } from "../dialog-parcelamentos/dialog-parcelamentos.component";
import { DialogPixComponent } from "../dialog-pix/dialog-pix.component";
import {EfiChargeRequest} from "../../../interfaces/efi-charge-request";


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

   console.log('Dados da', this.pagamento.tipoOrigem,' o seu ID origem ', this.pagamento.origemId,
     ' o ID pagamento  ', this.pagamento.idPagamento, 'para iniciar o pagamento de', this.pagamento.pagador);
  }

  ngOnInit(): void {
    this.carregarPagamentos();
   this.setupAutocompleteFilters();
  }

  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.complete();
  }


  carregarPagamentos() {

    this.pagamentoService.buscarPorOrigem(this.data.origemId, this.data.tipoOrigem)
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          //this.onError('Sua sessão expirou!');
          this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: iPagamento[]) => {
        console.log('Lista de pagamentos => ', result)
        this.tbSourcePagamentos$.data = result;
        this.tbSourcePagamentos$.paginator = this.paginator;
      });
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
     /* switchMap(value => typeof value === 'string' && value.length >= 1
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


  onFormaPagamentoSelect(event: MatAutocompleteSelectedEvent) {
    const tipo = event.option.value;
    const documento = this.pagamento.pagador.cnpj || this.pagamento.pagador.cpf || "";

    const payload  = {
      idPagamento: this.pagamento.origemId,
      valorPago: this.pagamento.valorPago,
      dtPagamento: this.pagamento.dtPagamento,
      formaPagamento: tipo,
      numberCard: this.pagamento.numeroCartao,
      nomeCliente: this.pagamento.pagador.nomeCliente,
      cpf: documento.replace(/\D/g, ""),
      qrcodeImage: null,
      copiaECola: null
    };

    const msgConfirma = tipo === 'Pix' || tipo === 'Boleto'
      ? `Deseja gerar um ${tipo} no valor de R$ ${payload.valorPago}?`
      : `Confirma o pagamento em ${tipo} no valor de R$ ${payload.valorPago}?`;

    this.notificationMsg.openConfirmDialog(msgConfirma).afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      switch (tipo) {
        case 'Pix':
        case 'Boleto':
          // Lógica que estava no confirmarPagamentoEfi
          if (this.pagamento.dtPagamento) {
            this.pagamentoService.gerarCobrancaEfiViaPix(payload).subscribe({
              next: (res) => {
                if (tipo === 'Pix') this.abrirModalPix(res.qrcode);
                else window.open(res.linkBoleto, '_blank');
              },
              error: (err) => this.tratarErroPagamento(err)
            });
          } else {
            this.listarPagamentos(this.data.origemId, this.data.tipoOrigem);
          }
          break;

        case 'Cartão em Crédito':
          this.pagamentoService.gerarCobrancaCard(payload).subscribe({
            next: (res) => {
              this.statusPgControl.setValue('Parcelada');
              this.gerarParcelas(this.pagamento.valorPago);
              console.log('Cobrança de cartão gerada:', res);
            },
            error: (err) => this.tratarErroPagamento(err)
          });
          break;

        case 'Dinheiro':
        case 'Cartão em Débito':
          this.statusPgControl.setValue('Fechada');
          // Se houver integração para débito/dinheiro, insira a chamada aqui
          break;

        default:
          console.warn('Forma de pagamento não reconhecida:', tipo);
      }
    });
  }

// Método auxiliar para evitar repetição de código
  private tratarErroPagamento(err: any) {
    console.error(err);
    this.notificationMsg.sendError("Erro ao gerar cobrança na Efí. Verifique os dados do cliente.");
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

  onMatSortChange() {
    this.tbSourcePagamentos$.sort = this.sort;
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourcePagamentos$.filter = valor;
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
