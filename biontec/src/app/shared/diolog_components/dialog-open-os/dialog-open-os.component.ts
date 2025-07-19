import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import { ErrorDiologComponent } from "../error-diolog/error-diolog.component";
import {ICliente} from "../../../interfaces/cliente";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";
import {ClienteService} from "../../../services/cliente.service";
import {catchError, map, startWith} from "rxjs/operators";
import {IFuncionario} from "../../../interfaces/funcionario";
import {FuncionarioService} from "../../../services/funcionario.service";
type ServiceSearchMethod = (nome: string) => Observable<ICliente[] | IFuncionario[]>;

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent implements OnInit {
  isChange = false;
  osSelecionada!: iServiceOrder;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  funcionarios: IFuncionario[] = [];

  clienteControl = new FormControl('', [Validators.required]);
  clientesFiltrados!: Observable<ICliente[]>;
  clientes: ICliente[] = [];
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public os: iServiceOrder,
    public dialogRef: MatDialogRef<DialogOpenOsComponent>,
    public osServices: OrdemDeServicosService,
    public funcionarioServices: FuncionarioService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.verificarFuncionario();
    this.verificarCliente();
  }

  ngOnInit(): void {
  }


  verificarCliente(){
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value:any) => {
        if (typeof value === 'string'&& value.length < 2) {
            return of([]);
          }else {
          return this.clienteService.getClientePorNome(value).pipe(
            catchError(() => {
              console.error('Erro ao buscar clientes');
              return of([]);
            })
          );
        } if (value && value.nomeCliente) {
          return of([value]);
        }
      })
    );
  }

  displayFn(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }


  listarClientes() {
    if (this.clienteControl.valid) {
      const value = this.clienteControl.value;
      if (typeof value === 'string') {
        this.clienteService.getClientePorNome(value).subscribe(
          (result: ICliente[]) => {
            console.log('resutado do lista', result)
            if (result.length > 0) {
              this.etapa = 2;
            } else {
              this.onError('Cliente não encontrado');
            }
          },
          error => {
            if (error.status === 404) {
              this.onError('Erro ao buscar cliente.');
            }
          }
        );
      } else {
        // Já temos um cliente selecionado
        this.etapa = 2;
      }
    }
  }

 verificarFuncionario(){
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value:any) => {
        if (typeof value === 'string') {
          return this.filtrarFuncionarios(value);
        } else if (value && value.nomeFuncionario) {
          return of([value]);
        } else {
          return of([]);
        }
      })
    );
  }

  filtrarFuncionarios(nome: string): Observable<IFuncionario[]> {
    if (nome.length < 2) {
      return of([]);
    }
    return this.funcionarioServices.getFuncionarioPorNome(nome).pipe(
      catchError(() => {
        console.error('Erro ao buscar funcionarios');
        return of([]);
      })
    );
  }

 displayFnFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
  }

  listarFuncionario(){

    if (this.funcionarioControl.valid) {
      const value = this.funcionarioControl.value;
      if (typeof value === 'string') {
       this.funcionarioServices.getFuncionarioPorNome(value).subscribe(
          (result: IFuncionario[]) => {
            if (result.length > 0) {
              this.etapa = 2;
            } else {
              this.onError('Funcionario não encontrado');
            }
          },
          error => {
            if (error.status === 404) {
              this.onError('Erro ao buscar Funcionario.');
            }
          }
        );
      } else {
        // Já temos um Funcionario selecionado
        this.etapa = 2;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selecionarCliente(): void {
    this.dialogRef.close(this.clientes);
  }

  statusDaOS(){
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }
  onError(message: string) {
    console.error(message);
  }

  onCancel() {
    this.voltar();
    this.dialogRef.close();
  }

  save(os: iServiceOrder) {
    // falta implementar
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }


  }
