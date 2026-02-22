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
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {DialogFuncionarioComponent} from "../../shared/dialogs/dialog-funcionario/dialog-funcionario.component";

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

  openDialogo(eventFunc: IFuncionario) {
    console.log("Dados do elementoDialog", eventFunc)
    const dialogRef = this.dialog.open(DialogFuncionarioComponent, {
      width: '300px',
      data: eventFunc === null ? {
        idFuncionario: null, nomeFuncionario: '', dtNascimnento: '', dtAdmissao: '',
        dtDemissao: '', pessoa: '', cpf: '', cnpj: '', rg: '', cep: '',
        tipo_logradouro: '', logradouro: '', n_residencial: null, bairro: '',
        complemento: '', cidade: '', uf: '', telefone: '', celular: '',
        zap: '', email: '', salario: null, obs: '', cargo: ''
      } : {
        idFuncionario: eventFunc.idFuncionario,
        nomeFuncionario: eventFunc.nomeFuncionario ?? "",
        dtNascimnento: eventFunc.dtNascimnento ?? "",
        dtAdmissao: eventFunc.dtAdmissao ?? "",
        dtDemissao: eventFunc.dtDemissao ?? "",
        pessoa: eventFunc.pessoa ?? "",
        cpf: eventFunc.cpf ?? "",
        cnpj: eventFunc.cnpj ?? "",
        rg: eventFunc.rg ?? "",
        cep: eventFunc.cep ?? "",
        tipo_logradouro: eventFunc.tipo_logradouro ?? "",
        logradouro: eventFunc.logradouro ?? "",
        n_residencial: eventFunc.n_residencial,
        bairro: eventFunc.bairro ?? "",
        complemento: eventFunc.complemento ?? "",
        cidade: eventFunc.cidade ?? "",
        uf: eventFunc.uf ?? "",
        telefone: eventFunc.telefone ?? "",
        celular: eventFunc.celular ?? "",
        zap: eventFunc.zap ?? "",
        email: eventFunc.email ?? "",
        salario: eventFunc.salario,
        obs: eventFunc.obs ?? "",
        cargo: eventFunc.cargo ?? ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Valor do result', result)
      if (result.idFuncionario !== null) {
        if (this.tbSourceFuncionarios$.data
          .map(p => p.idFuncionario).includes(result.id_funcionario)) {
          this.funcionarioSevice.editElement(result)
            .subscribe((data: IFuncionario) => {
              const index = this.tbSourceFuncionarios$.data
                .findIndex(p => p.idFuncionario === data.idFuncionario);
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
    this.tbSourceFuncionarios$.data.filter(funcionarios => funcionarios.idFuncionario.toString()
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


