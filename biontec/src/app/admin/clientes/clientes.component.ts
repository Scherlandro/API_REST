import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Form, FormControl, NgForm} from "@angular/forms";
import {ICliente} from "../../interfaces/cliente";
import {ClienteService} from "../../services/cliente.service";
import {DialogClienteComponent} from "../../shared/diolog_components/dialog-cliente/dialog-cliente.component";
import {ConsultaCepService} from "../../services/consulta-cep.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {TokenService} from "../../services/token.service";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {NotificationMgsService} from "../../services/notification-mgs.service";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  @ViewChild(MatTable) tableCliente!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['nome_cliente', 'pessoa', 'estado', 'opicoes'];
  tbSourceClientes$: MatTableDataSource<ICliente>;
  tbData:any;
  clienteControl = new FormControl();
  clienteFilted: ICliente[] = [];
  buscaDigitada: any;
  ruwSelec: any;

  constructor(public dialog: MatDialog,
              private tokenServer: TokenService,
              public notificationMsg:  NotificationMgsService,
              private clienteSevice: ClienteService
  ) {
    this.tbSourceClientes$ = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarClientes();
  }

  onMatSortChange() {
    this.tbSourceClientes$.sort = this.sort;
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceClientes$.filter = valor;
  }


  listarClientes() {
    this.clienteSevice.getTodosClientes()
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: ICliente[]) => {
        this.tbSourceClientes$.data = result;
        this.tbSourceClientes$.paginator = this.paginator;
      });
  }

  /*
    buscar(){
      if(this.clienteControl.value == ""){  this.ngOnInit();
      }else{  this.dataSourceCliente$ = this.dataSourceCliente$.filter(
          res => { return res.estado.toLocaleLowerCase()
              .match(this.clienteControl.value.toLocaleLowerCase());  })}
    }
  */

  openDialogo(eventCli: ICliente) {
    console.log("Dados do elementoDialog", eventCli)
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: '300px',
      data: eventCli === null ? {
        id_cliente: null, nome_cliente: '', inscricaoest: '', pessoa: '',
        cpf: '', cnpj: '', cep: '', numero: '', telefone: '', celular: '', zap: '',
      } : {
        id_cliente: eventCli.id_cliente,
        nome_cliente: eventCli.nome_cliente,
        inscricaoest: eventCli.inscricaoest,
        pessoa: eventCli.pessoa,
        cpf: eventCli.cpf,
        cnpj: eventCli.cnpj,
        cep: eventCli.cep,
        numero: eventCli.numero,
        telefone: eventCli.telefone,
        celular: eventCli.celular,
        zap: eventCli.zap,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.tbSourceClientes$.data
          .map(p => p.id_cliente).includes(result.id_cliente)) {
          this.clienteSevice.editElement(result)
            .subscribe((data: ICliente) => {
              const index = this.tbSourceClientes$.data
                .findIndex(p => p.id_cliente === data.id_cliente);
              this.tbSourceClientes$.data[index] = data;
              this.tableCliente.renderRows();
            });
        } else {
          this.clienteSevice.createCliente(result)
            .subscribe((data: ICliente) => {
              this.tbSourceClientes$.data.push(result);
              this.tableCliente.renderRows();
            });
        }
      }
    });
  }

  editarElement(eventCli: ICliente) {
    this.openDialogo(eventCli);
  }

  deleteElement(position: number) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este cliente ?')
      .afterClosed().subscribe(res =>{
      if(res){
      this.clienteSevice.deleteElement(position)
        .subscribe((result: ICliente[]) => {
          this.tbData  =  this.tbSourceClientes$.data;
          this.tbData.splice( this.ruwSelec,1);
          this.tbSourceClientes$.data = this.tbData;

        });
      }
    });
  }

  changeCliente(value: any) {
    this.tbSourceClientes$.data.filter(clientes => clientes.id_cliente.toString()
      .includes(value.toUpperCase()));
  }

  selectRow(row:any){
    this.ruwSelec = this.tbSourceClientes$.filteredData.indexOf(row);
    }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

}


