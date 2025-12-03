import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {catchError, delay, first} from "rxjs/operators";
import {of, takeUntil} from "rxjs";
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
import {DialogItensOSComponent} from "../../shared/diolog_components/dialog-itens-os/dialog-itens-os.component";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import { ChangeDetectorRef } from '@angular/core';



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
export class OrdemDeServiceComponent implements OnInit{
  spiner = false;
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
  displayedColumns: string[] = ['codOS','codigo', 'descricao', 'preco', 'qtd', 'soma', 'imagem', 'opcoes'];
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
    public notificationMsg:  NotificationMgsService,
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
      .pipe(first(), delay(1500),catchError(error => {
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

  listOrderById(id:any) {
    this.osService.getById(id)
      .pipe(first(), delay(1500),catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
          this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: any) => {
        console.log('Os por cod ', result)
        return result;
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
    this.tbSourceOS$.data.forEach((item:any) => {
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
        .reduce((acc: number, item: iItensOS)=> acc + Number(item.total))

      element.totalgeral = soma;
      element.totalgeral = this.formatarReal(soma);
      console.log('Valor soma', element.totalgeral);
      this.tbSourceItensDaOS$.data = element.itensOS.map((item: iItensOS) => ({
        ...item,
        // Formata os valores individuais
        valorUnitario: this.formatarReal(item.valorUnitario),
        total: this.formatarReal(item.total)
      }));
    }
  }

  recalcularTotalOS(elementOS: any) {
    console.log("recalcularTotalOS", elementOS.idOS, 'EventOS' , elementOS, 'Lengh',elementOS.itensOS.length)

    if (!elementOS.idOS || elementOS.itensOS.length === 0) {
      elementOS.totalGeralOS = 0;
      elementOS.totalGeralOS = this.formatarReal(0);
      return;
    }

    const soma = elementOS.itensOS.reduce((acc:number, item:any) => {
      return acc + Number(item.total);
    }, 0);

    elementOS.totalGeralOS = soma;
    elementOS.totalGeralOS = this.formatarReal(soma);

    // força refresh visual
    //this.tableOS.renderRows();
    this.cdRef.detectChanges();
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

  openDilogOS() {
    const dialogRef = this.dialog.open(DialogOpenOsComponent, {
      width: '280px',
      height: '300px',
      data: { /* dados vázio */}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteSelecionado = result;
        console.log('Cliente selecionado:', this.clienteSelecionado);
      }
    });

  }

  openDilogItenOS(eventOS: any) {
    console.log("IdItensOS", eventOS.itensOS, 'EventOS' , eventOS)
    const dialogRef = this.dialog.open(DialogItensOSComponent, {
      width: '300px',
      data: eventOS.itensOS === undefined ? {
        idItensDaOS: eventOS.idItensDaOS,
        codOS: eventOS.codOS,
        codProduto: eventOS.codProduto,
        descricao: eventOS.descricao,
        valorUnitario: parseFloat(eventOS.valorUnitario.replace('R$','').trim().replace(',','.')) || 0,
        quantidade: eventOS.quantidade,
        total: parseFloat(eventOS.total.replace('R$','').trim().replace(',','.')) || 0,
      } : {
        idItensDaOS: null,
        codOS: eventOS.idOs,
        codProduto: '',
        descricao: '',
        valorUnitario: null,
        quantidade: null,
        total: null
      }
    });

    dialogRef.afterClosed().subscribe((eventOS) => {
      //console.log('AferClosed EventIOS', eventOS)




        // Verifica se os campos obrigatórios estão preenchidos
        if (eventOS) {
         const ordens =  this.listOrderById(eventOS.codOS);
          console.log('AferClosed ordens, total', ordens,eventOS.total)
         /*     this.osService.update(eventOS.idOS,...eventOS.total).pipe(
          //  takeUntil(this.destroy$)
          ).subscribe({
            next: (osAtualizada) => {
             // this.dialogRef.close(osAtualizada);
            },
            error: (err) => {
              this.onError('Erro ao atualizar a OS');
              console.error(err);
            }
          });*/
        }



      /*  if (itemEditadoOuAdicionado) {
           // Se estiver editando um item existente
           const index = eventOS.itensOS.findIndex((i:any) => i.idItensDaOS === itemEditadoOuAdicionado.idItensDaOS);

           if (index >= 0) {
             // Atualiza o item
             eventOS.itensOS[index] = itemEditadoOuAdicionado;
           } else {
             // Adiciona o item
             eventOS.itensOS.push(itemEditadoOuAdicionado);
           }
         }*/
      // REPROCESSAR TOTAL
    //  this.recalcularTotalOS(eventOS);
    });

  }

  deleteElement(item: iItensOS) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item ?')
      .afterClosed().subscribe(res =>{
      if(res){
        this.itensOsService.deleteItensOS(item)
          .subscribe((item) => {
            this.tbData  = this.tbSourceItensDaOS$.data;
            this.tbData.splice( this.ruwSelec,1);
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
            elementOS.itensOS = elementOS.itensOS.filter((i:any) => i.idItensDaOS !== item.idItensDaOS);
            this.recalcularTotalOS(elementOS);
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
  formatarReal(valor: number | string): string {
    // Converte para número se for string
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

  //  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(numero);

    // Formata para Real brasileiro
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

}
