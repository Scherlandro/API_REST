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
import {CurrencyBRLPipe} from "../../shared/pipes/currency-brl.pipe";


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
  @ViewChild('tableOS') tableOS!: MatTable<any>;
  @ViewChild('tableItensOS') tableItensOS!: MatTable<any>;
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
  displayedColumns: string[] = ['codOS', 'codigo', 'descricao', 'preco', 'qtd', 'soma', 'imagem', 'opcoes'];
  OSControl = new FormControl();
  formatarMoeda = new CurrencyBRLPipe();

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
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.spiner = true;
    this.osService.getAll()
      .pipe(first(), catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: iServiceOrder[]) => {
        this.tbSourceOS$.data = result;
        this.tbSourceOS$.paginator = this.paginator;
        this.spiner = false;
      });
  }

  openDilogOS() {

    const os: iServiceOrder = {
      idOS: 0, idCliente: 0, idFuncionario: 0, nomeCliente: '', nomeFuncionario: '',
      dataDeEntrada: '', ultimaAtualizacao: '', status: '', subtotal: 0,
      desconto: 0, totalGeralOS: 0, porConta: 0, restante: 0,

      itensOS : {
        idItensDaOS: 0, codOS: 0, codProduto: '', descricao: '', valorUnitario: 0,
        quantidade: 1, total: 0
      }
    };

    const itens: iItensOS = os.itensOS;

    const dialogRef = this.dialog.open(DialogOpenOsComponent, {
      data: {
        modoNew: 'adicionar', modo: 'adicionar',
        ...os,
        itensOS: { ...itens, codOS: os.idOS }
      }
    });

    dialogRef.afterClosed().subscribe((result: iServiceOrder) => {
      if (result) {
        const data = [...this.tbSourceOS$.data]; // Cria cópia do array atual
        const index = data.findIndex(os => os.idOS === result.idOS);
        if (index > -1) {
          // MODO EDIÇÃO: Substitui o item antigo pelo novo
          data[index] = result;
        } else {
          // MODO ADIÇÃO: Adiciona ao início ou fim da lista
          data.unshift(result);
        }
        this.tbSourceOS$.data = data; // Atualiza o DataSource (refresca a tela)
        this.notificationMsg.success('Operação realizada com sucesso!');
      }
    });
  }

  editarOS(elementOS: iServiceOrder) {
    this.openDilogItenOS(elementOS);
  }


  openDilogItenOS(os: iServiceOrder, item?: iItensOS) {
    const isEdit = !!item;
    const isNovaOS = !os.itensOS; // nova OS recém criada

    const emptyItem: iItensOS = {
      idItensDaOS: 0,
      codOS: os.idOS ?? 0,
      codProduto: '',
      descricao: '',
      valorUnitario: 0,
      quantidade: 1,
      total: 0
    };
    // Define o item a ser enviado (novo ou existente)
    const itens = isEdit ? item : emptyItem;

    const dialogRef = this.dialog.open(DialogOpenOsComponent, {
      data: {
        modoNew: isNovaOS ? 'adicionar' : 'editar',
        modo: isEdit ? 'editar' : 'adicionar',
         ...os,
        itensOS: { ...itens, codOS: os.idOS }
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

  toggleRow(element: any) {
    this.tbSourceOS$.data.forEach((item: any) => {
      if (item !== element && item.isExpanded) {
        item.isExpanded = false;
      }
    });
    // Alternar o estado da linha clicada
    element.isExpanded = !element.isExpanded;

      if (element.isExpanded && element.itensOS && Array.isArray(element.itensOS)) {
        const soma = element.itensOS.reduce((acc: number, item: iItensOS) => {
          // Garantir que 'item.total' seja um número válido
          const valorItem = typeof item.total === 'number' ? item.total : Number(this.formatarMoeda.transform(item.total));
          return acc + valorItem;
          /* return acc + (Number(item.total) || 0);*/
        }, 0);
        // 2. Arredonda para 2 casas decimais para evitar erros de precisão do JS
        element.totalGeralOS = Math.round(soma * 100) / 100;
        this.updateOS(element);
      }

  }

  updateOS(os: iServiceOrder) {
    this.osService.update(os)
      .subscribe({
        next: (osAtualizada) => {
          this.tbData?.close(osAtualizada);
        },
        error: (err) => {
          this.onError('Erro ao atualizar a OS');
          console.error(err);
        }
      });
    //  this.tbData.splice(this.ruwSelec, 1);
  }

  salvarTotal(os: iServiceOrder) {
    this.osService.update(os).subscribe({
      next: () => console.log('Total atualizado com sucesso'),
      error: err => {
        this.onError('Erro ao atualizar total da OS');
        console.error(err);
      }
    });
  }

  getBaseCauculo(os: iServiceOrder, itens: iItensOS): any {
    switch (os || itens) {
      case os.itensOS.total:
        return os.itensOS.total + itens.total;
      case os:
        return os.subtotal + itens.total;
    } }


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
    eventOS.totalGeralOS = Number(this.formatarMoeda.transform(soma));

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

  deleteOS(eventOS: iServiceOrder) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER esta OS?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.osService.delete(eventOS.idOS).subscribe({
          next: () => {
            // Filtra o array removendo o item deletado
            this.tbSourceOS$.data = this.tbSourceOS$.data.filter(os => os.idOS !== eventOS.idOS);
            this.notificationMsg.warn('Deletado com sucesso!');
          },
          error: () => this.onError('Erro ao deletar no servidor')
        });
      }
    });
  }

  deleteElement(item: iItensOS) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item ?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.itensOsService.deleteItensOS(item).subscribe(() => {
          //Localiza a OS que contém esse item
          const osPai = this.tbSourceOS$.data.find(os => os.idOS === item.codOS);

          if (osPai && osPai.itensOS) {
            // Remove o item do array interno
            const index = osPai.itensOS.findIndex((i: any) => i.idItensDaOS === item.idItensDaOS);
            if (index > -1) {
              osPai.itensOS.splice(index, 1);
              //Força a atualização da tabela pai para refletir novos cálculos/totais
              this.tbSourceOS$.data = [...this.tbSourceOS$.data];
              this.toggleRow(osPai);
            }
          }
          this.notificationMsg.warn('Item removido!');
        });
      }
    });
  }

  formatarData(dataString: string): Date {
    return new Date(dataString);
  }
/*
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

  private parseCurrency(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    // Se já é número, retorna direto
    if (typeof value === 'number') return value;

    try {
      return parseFloat(
        value.replace('R$', '')
          .replace(/\./g, '') // Remove todos os pontos de milhar
          .replace(',', '.')  // Troca a vírgula decimal por ponto
          .trim()
      ) || 0;
    } catch {
      return 0;
    }
  }*/

}
