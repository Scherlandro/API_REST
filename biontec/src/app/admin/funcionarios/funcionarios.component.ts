import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Form, FormControl, NgForm} from "@angular/forms";
import {IFuncionario} from "../../interfaces/funcionario";
import {FuncionarioService} from "../../services/funcionario.service";
import {ConsultaCepService} from "../../services/consulta-cep.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {TokenService} from "../../services/token.service";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {DialogFuncionarioComponent} from "../../shared/diolog_components/dialog-funcionario/dialog-funcionario.component";

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {

  @ViewChild(MatTable) tableFuncionario!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['nomeFuncionario', 'cargo', 'telefone', 'opicoes'];
  tbSourceFuncionarios$: MatTableDataSource<IFuncionario>;
  tbData:any;
  funcionarioControl = new FormControl();
  funcionarioFilted: IFuncionario[] = [];
  buscaDigitada: any;
  ruwSelec: any;

  constructor(public dialog: MatDialog,
              private tokenServer: TokenService,
              public notificationMsg:  NotificationMgsService,
              private funcionarioSevice: FuncionarioService
  ) {
    this.tbSourceFuncionarios$ = new MatTableDataSource();
  }

  ngOnInit(): void {
   this.listarFuncionarios();
  }

  onMatSortChange() {
    this.tbSourceFuncionarios$.sort = this.sort;
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceFuncionarios$.filter = valor;
  }


  listarFuncionarios() {

    this.funcionarioSevice.getTodosFuncionarios()
      .pipe(catchError(error => {
        if (error === 'Session Expired')
          this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      })).subscribe(
      (result: IFuncionario[]) => {
        this.tbSourceFuncionarios$.data = result;
        this.tbSourceFuncionarios$.paginator = this.paginator;
      });
  }

  /*
    buscar(){
      if(this.funcionarioControl.value == ""){  this.ngOnInit();
      }else{  this.dataSourceFuncionario$ = this.dataSourceFuncionario$.filter(
          res => { return res.estado.toLocaleLowerCase()
              .match(this.funcionarioControl.value.toLocaleLowerCase());  })}
    }
  */

  openDialogo(eventFunc: IFuncionario) {
    console.log("Dados do elementoDialog", eventFunc)
    const dialogRef = this.dialog.open(DialogFuncionarioComponent, {
      width: '300px',
      data: eventFunc === null ? {
        id_funcionario: null, nomeFuncionario: '', dt_admissao: '',dt_demissao: '' , pessoa: '',
        cpf: '', cnpj: '', cep: '', numero: '', telefone: '', celular: '', zap: '',
      } : {
        id_funcionario: eventFunc.idfuncionario,
        nomeFuncionario: eventFunc.nomeFuncionario,
        dt_admissao: eventFunc.dt_admissao,
        dt_demissao: eventFunc.dt_demissao,
        pessoa: eventFunc.pessoa,
        cpf: eventFunc.cpf,
        cnpj: eventFunc.cnpj,
        cep: eventFunc.cep,
        numero: eventFunc.numero,
        telefone: eventFunc.telefone,
        celular: eventFunc.celular,
        zap: eventFunc.zap,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.tbSourceFuncionarios$.data
          .map(p => p.idfuncionario).includes(result.id_funcionario)) {
          this.funcionarioSevice.editElement(result)
            .subscribe((data: IFuncionario) => {
              const index = this.tbSourceFuncionarios$.data
                .findIndex(p => p.idfuncionario === data.idfuncionario);
              this.tbSourceFuncionarios$.data[index] = data;
              this.tableFuncionario.renderRows();
            });
        } else {
          this.funcionarioSevice.createFuncionario(result)
            .subscribe((data: IFuncionario) => {
              this.tbSourceFuncionarios$.data.push(result);
              this.tableFuncionario.renderRows();
            });
        }
      }
    });
  }

  editarElement(eventFunc: IFuncionario) {
    this.openDialogo(eventFunc);
  }

  deleteElement(position: number) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este funcionario ?')
      .afterClosed().subscribe(res =>{
      if(res){
      this.funcionarioSevice.deleteElement(position)
        .subscribe((result: IFuncionario[]) => {
          this.tbData  =  this.tbSourceFuncionarios$.data;
          this.tbData.splice( this.ruwSelec,1);
          this.tbSourceFuncionarios$.data = this.tbData;

        });
      }
    });
  }

  changeFuncionario(value: any) {
    this.tbSourceFuncionarios$.data.filter(funcionarios => funcionarios.idfuncionario.toString()
      .includes(value.toUpperCase()));
  }

  selectRow(row:any){
    this.ruwSelec = this.tbSourceFuncionarios$.filteredData.indexOf(row);
    }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

}


