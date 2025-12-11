import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {catchError, delay, first} from "rxjs/operators";
import {of, Subject, takeUntil, throwError} from "rxjs";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {OrdemDeServicosService} from "../../services/ordem-de-servicos.service";
import {iServiceOrder} from "../../interfaces/service-order";
import {ICliente} from "../../interfaces/cliente";
import {ItensOsService} from "../../services/itens-os.service";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {iItensOS} from "../../interfaces/itens-os";
import {DialogOpenOsComponent} from "../../shared/diolog_components/dialog-open-os/dialog-open-os.component";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {ChangeDetectorRef} from '@angular/core';


@Component({
  selector: 'app-list-ordem-de-service',
  templateUrl: './ordem-de-service.component.html',
  styleUrls: ['./ordem-de-service.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdemDeServiceComponent implements OnInit {
  spiner = false;
  destroy$ = new Subject<void>();
  @ViewChild(MatTable) tableOS!: MatTable<any>;
  @ViewChild(MatTable) tableItensOS!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  tbData: any;
  ruwSelec: any;

  orders: iServiceOrder[] = [];
  clienteFilted: ICliente[] = [];
  clienteSelecionado: ICliente | null = null;
  tbSourceOS$: MatTableDataSource<iServiceOrder>;
  displayedColumns0S = ['Nome', 'Data', 'Status', 'Total', 'Opcoes'];
  tbSourceItensDaOS$: MatTableDataSource<iItensOS>;
  displayedColumns: string[] = ['codOS', 'codigo', 'descricao', 'preco', 'qtd', 'soma', 'imagem', 'opcoes'];
  OSControl = new FormControl();

  searchForm = this.fb.group({
    searchType: ['code'],
    searchTerm: [''],
    status: [''],
    startDate: [''],
    endDate: ['']
  });

  constructor(
    private osService: OrdemDeServicosService,
    private itensOsService: ItensOsService,
    private cdRef: ChangeDetectorRef,
    private tokenServer: TokenService,
    public notificationMsg: NotificationMgsService,
    private itensOs: ItensOsService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.tbSourceOS$ = new MatTableDataSource();
    this.tbSourceItensDaOS$ = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.spiner = true;
    this.osService.getAll()
      .pipe(first(), delay(1500), catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: iServiceOrder[]) => {
        this.tbSourceOS$.data = result;
        console.log('tbSourceos$ ', this.tbSourceOS$.data.map((i) => i.itensOS))
        this.tbSourceOS$.paginator = this.paginator;
        this.spiner = false;
      });
  }

  openDilogOS() {
    const dialogRef = this.dialog.open(DialogOpenOsComponent, {

      data: { /* dados vázio */}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteSelecionado = result;
      }
    });
  }

  openDilogItenOS(eventOS: iServiceOrder, item?: any) {
    console.log("itensOS", eventOS.itensOS, '------------> OS', eventOS)

    const isEdit = !!item;  // SE item existe → modo editar
    const itens = isEdit ? item : {};

    const valorUnitario = itens.valorUnitario ? parseFloat(itens.valorUnitario.replace('R$', '').trim().replace(',', '.')) : 0;
    const total = itens.total ? parseFloat(itens.total.replace('R$', '').trim().replace(',', '.')) : 0;

    const osCompleta = eventOS;

    const dialogRef = this.dialog.open(DialogOpenOsComponent, {
      data:  {
        modo: isEdit ? 'editar' : 'adicionar',
        idOS: eventOS.idOS,
        idCliente: eventOS.idCliente,
        nomeCliente: eventOS.nomeCliente,
        idFuncionario: eventOS.idFuncionario,
        nomeFuncionario: eventOS.nomeFuncionario,
        dataDeEntrada: eventOS.dataDeEntrada,
        ultimaAtualizacao: eventOS.ultimaAtualizacao,
        status: eventOS.status,
        subtotal: eventOS.subtotal,
        desconto: eventOS.desconto,
        totalGeralOS: eventOS.totalGeralOS,
        porConta: eventOS.porConta,
        restante: eventOS.restante,
        itensOS: {
          idItensDaOS: itens.idItensDaOS || null,
          codOS: itens.codOS || null,
          codProduto: itens.codProduto || null,
          descricao: itens.descricao || '',
          valorUnitario,
          quantidade: itens.quantidade || 1,
          total
        }
      }
    });
    dialogRef.afterClosed().subscribe((eventOS) => {
      this.recalcularTotalOS(osCompleta, eventOS);
      if (eventOS) {
        console.log('OS RECALCULADA ', this.recalcularTotalOS(osCompleta, eventOS))
        this.updateOS(osCompleta);
      }
    });
  }

  updateOS(eventOS: iServiceOrder) {
    console.log('OS para atulizar', eventOS);
    this.osService.getById(eventOS.idOS)
      .pipe(first(), delay(200),
        catchError(error => {
          if (error.status === 401) {
            this.onError('Sua sessão expirou!');
            this.tokenServer.clearTokenExpired();
          }
          return throwError(() => error); // não retornar []
        }))
      .subscribe({
        complete: () => {
        },
        next: (result: iServiceOrder) => {
          console.log('OS atualizada', result);
          if (!result) {
            this.onError("OS não encontrada!");
            return;
          }
          this.osService.update(result).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: (newOS) => {
              console.log('Update OS', newOS);
            },
            error: err => {
              this.onError('Erro ao atualizar a OS');
              console.error(err);
            }
          });
        },
        error: err => {
          console.error("Erro no GET", err);
        }
      });
  }

  onSearch() {
    const params = this.prepareSearchParams();
    this.osService.search(params).subscribe(orders => this.orders = orders);
  }

  prepareSearchParams(): any {
    const formValue = this.searchForm.value;
    const params: any = {};

    if (formValue.searchTerm) {
      if (formValue.searchType === 'code') {
        // Handle code search
      } else if (formValue.searchType === 'client') {
        params.clientName = formValue.searchTerm;
      } else if (formValue.searchType === 'plate') {
        params.plate = formValue.searchTerm;
      }
    }
    if (formValue.status) {
      params.status = formValue.status;
    }
    if (formValue.startDate && formValue.endDate) {
      params.startDate = formValue.startDate;
      params.endDate = formValue.endDate;
    }
    return params;
  }

  changeOS(value: any) {
    if (value) {
      this.orders = this.orders.filter(
        vd => vd.nomeCliente.toString()
          .includes(value.toUpperCase()));
    } else {
      this.orders = this.orders;
    }
  }

  toggleRow(element: any) {
    this.tbSourceOS$.data.forEach((item: any) => {
      if (item !== element && item.isExpanded) {
        item.isExpanded = false;
      }
    });
    // Alternar o estado da linha clicada
    element.isExpanded = !element.isExpanded;
    // Se a linha foi expandida, carregar os dados
    if (element.isExpanded) {
      /*  var soma = 0;
        for (var i = 0; i < element.length; i++) {
          soma += element.map((p: iItensOS) => p.valorUnitario)[i];
        }*/
      const soma = element.itensOS
        .reduce((acc: number, item: iItensOS) => acc + Number(item.total))

      element.totalGeralOS = soma;
      element.totalGeralOS = this.formatarReal(soma);
      console.log('Valor soma', element.totalGeralOS);
      this.tbSourceItensDaOS$.data = element.itensOS.map((item: iItensOS) => ({
        ...item,
        // Formata os valores individuais
        valorUnitario: this.formatarReal(item.valorUnitario),
        total: this.formatarReal(item.total)
      }));
    }
  }

  recalcularTotalOS(eventOS: iServiceOrder, eventItens: iItensOS): iServiceOrder {
    // Verifica se a OS ou os itens estão vazios
    if (!eventOS.idOS || !eventOS.itensOS || eventOS.itensOS.length === 0) {
      eventOS.totalGeralOS = 0;
      return eventOS;
    }
    const soma = eventOS.itensOS.reduce((acc: number, item: any) => {
      // Certifica que item.total seja um número válido
      const totalItem = parseFloat(item.total.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (!isNaN(totalItem)) {
        acc += totalItem;
      }
      return acc;
    }, 0);
    eventOS.totalGeralOS = soma;
    eventOS.totalGeralOS = this.formatarReal(soma);

    this.cdRef.detectChanges();
    return eventOS;
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceOS$.filter = valor;
  }

  deleteElement(item: iItensOS) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item ?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.itensOsService.deleteItensOS(item)
          .subscribe((item) => {
            this.tbData = this.tbSourceItensDaOS$.data;
            this.tbData.splice(this.ruwSelec, 1);
            this.tbSourceItensDaOS$.data = this.tbData;
          });
        this.notificationMsg.warn('! Deletado com sucesso!');
      }
    });
  }

  deleteElement2(item: iItensOS) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item ?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.itensOsService.deleteItensOS(item).subscribe(() => {
          const elementOS: any = this.tbSourceOS$.data.find(os => os.idOS === item.codOS);
          if (elementOS) {
            elementOS.itensOS = elementOS.itensOS.filter((i: any) => i.idItensDaOS !== item.idItensDaOS);
            this.recalcularTotalOS(elementOS, elementOS.itensOS);
          }
          this.tbData = this.tbSourceItensDaOS$.data;
          this.tbData.splice(this.ruwSelec, 1);
          this.tbSourceItensDaOS$.data = this.tbData;
          this.notificationMsg.warn('! Deletado com sucesso!');
        });
      }
    });
  }

  formatarData(dataString: string): Date {
    return new Date(dataString);
  }

  // Método para formatar valores para Real brasileiro
  formatarReal(valor: any): any {
    if (valor === null || valor === undefined) return "R$ 0,00";
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }
    if (typeof valor === 'string') {
      valor = valor
        .replace(/[^\d,.-]/g, '')  // Remove tudo exceto números, vírgula e ponto
        .replace(',', '.');        // Converte vírgula em ponto para parseFloat
    }
    // Converter para número, garantindo que o valor seja válido
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "R$ 0,00";

    return numero.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  }

}
