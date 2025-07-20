import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {catchError, delay} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {OrdemDeServicosService} from "../../services/ordem-de-servicos.service";
import {iServiceOrder} from "../../interfaces/service-order";
import {ICliente} from "../../interfaces/cliente";
import {IFuncionario} from "../../interfaces/funcionario";
import {ClienteService} from "../../services/cliente.service";
import {FuncionarioService} from "../../services/funcionario.service";
import {ItensOsService} from "../../services/itens-os.service";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {iItensOS} from "../../interfaces/itens-os";
import {DialogOpenOsComponent} from "../../shared/diolog_components/dialog-open-os/dialog-open-os.component";
import {DialogItensOSComponent} from "../../shared/diolog_components/dialog-itens-os/dialog-itens-os.component";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";


@Component({
  selector: 'app-list-ordem-de-service',
  templateUrl: './ordem-de-service.component.html',
  styleUrls: ['./ordem-de-service.component.css']
})
export class OrdemDeServiceComponent {

  @ViewChild(MatTable) tableOS!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;

  orders: iServiceOrder[] = [];
  clienteFilted: ICliente[] = [];
  clienteSelecionado: ICliente | null = null;
  tbSourceOS$: MatTableDataSource<iServiceOrder>;
  displayedColumns0S = ['Nome', 'Data', 'Status', 'Total', 'Opicões'];
  tbSourceItensDaOS$: any;
  displayedColumns: string[] = ['codigo', 'descricao', 'preco', 'qtd', 'soma', 'data', 'imagem', 'opicoes'];
  loadEmployees: any;

  OSControl = new FormControl();

  form: FormGroup;
  clients: ICliente[] = [];
  employees: IFuncionario[] = [];
  statusOptions = [
    'O.S em Andamento',
    'O.S Autorizada Aberta',
    'O.S Autorizada Fechada',
    'O.S Não Autorizada Aberta',
    'O.S Não Autorizada Fechada'
  ];


  searchForm = this.fb.group({
    searchType: ['code'],
    searchTerm: [''],
    status: [''],
    startDate: [''],
    endDate: ['']
  });

  constructor(
    private osService: OrdemDeServicosService,
    private tokenServer: TokenService,
    public notificationMsg:  NotificationMgsService,
    private itensOs: ItensOsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private employeeService: FuncionarioService
  ) {
    this.tbSourceOS$ = new MatTableDataSource();
    this.tbSourceItensDaOS$ = new MatTableDataSource();
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      technicianId: ['', Validators.required],
      status: ['O.S em Andamento', Validators.required],
      receiver: [''],
      subtotal: [0],
      discount: [0],
      onAccount: [0],
      total: [0],
      remaining: [0],
      subServices: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadOrders();
    //  this.loadEmployees();
  }

  loadOrders() {
    this.osService.getAll()
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
          this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: iServiceOrder[]) => {
        console.log('Lista de OSs ', result)
        this.tbSourceOS$.data = result;
        this.tbSourceOS$.paginator = this.paginator;
      });
  }

  loadOrders2() {
    this.osService.getAll().subscribe(
      orders => this.orders = orders);
  }

  consultarPorCliente(nome: string) {
    if (this.OSControl.valid) {
      this.osService.search(nome)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar Cliente!')
          return of([])
        }))
        .subscribe((result: iServiceOrder[]) => {
          this.aplicarFiltro(nome);
          this.tbSourceOS$.data = result;
        })
    }
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

  toggleRow(element: iServiceOrder) {
    console.log('ID da O.S selecionada ==> ', element.idOS.toString());
    this.itensOs.listarItensOSPorCodOS(element.idOS.toString())
      .pipe(catchError(error => {
        this.onError('Erro ao buscar Itens da O.S!')
        return of([])
      }))
      .subscribe((data: iItensOS[]) => {
        console.log('ItensOS ==> ', data);
        this.tbSourceItensDaOS$.data = data;
        var soma = 0;
        for (var i = 0; i < data.length; i++) {
          soma += data.map(i => i.valor_parcial)[i];
        }
        console.log('ItensOS somados', soma);
      });
  }

  get subServices(): FormArray {
    return this.form.get('subServices') as FormArray;
  }

  addSubService() {
    this.subServices.push(this.fb.group({
      assignedTechnicianId: ['', Validators.required],
      objectName: ['', Validators.required],
      plate: [''],
      color: [''],
      observations: [''],
      subtotal: [0],
      brandId: [''],
      modelId: [''],
      carrier: [''],
      carrierPhone: [''],
      items: this.fb.array([])
    }));
  }

  onSubmit() {
    if (this.form.valid) {
      this.osService.create(this.form.value).subscribe(
        response => {
          // handle success
        },
        error => {
          // handle error
        }
      );
    }
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

  buscarClientes(filter: string = ''): Observable<ICliente[]> {
    this.clienteFilted.map(c => {
      this.clienteService.getTodosClientes();
    });
    return of(
      this.clienteFilted.filter(cliente =>
        cliente.nomeCliente.toLowerCase().includes(filter.toLowerCase())
      )
    ).pipe(delay(500));
  }

  openDilogOS() {

    const dialogRef = this.dialog.open(DialogOpenOsComponent, {
      width: '280px',
      height: '300px',
      data: { /*  passar dados aqui se necessário */}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteSelecionado = result;
        console.log('Cliente selecionado:', this.clienteSelecionado);
      }
    });

  }

  openDilogItenOS(eventOS: any) {
    // console.log("Dados do elementoDialog", eventVd)
    const dialogRef = this.dialog.open(DialogItensOSComponent, {
      width: '300px',
      data: eventOS === null ? {
        cod_os: null,
        descricao: '',
        valor_venda: '',
        qtd_vendidas: ''
      } : {
        cod_os: eventOS.cod_os,
        descricao: eventOS.descricao,
        valor_venda: eventOS.valor_venda,
        qtd_vendidas: eventOS.qtd_vendidas,

      }
    });
  }

  formatter(value: number): string {
    //<div>{{ formatter(iProdroduto.valor_venda) }}</div>
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
  }

}
