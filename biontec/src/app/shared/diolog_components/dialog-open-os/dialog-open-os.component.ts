import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import {ICliente} from "../../../interfaces/cliente";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {ClienteService} from "../../../services/cliente.service";
import {catchError, map, startWith} from "rxjs/operators";
import {IFuncionario} from "../../../interfaces/funcionario";
import {FuncionarioService} from "../../../services/funcionario.service";
type ServiceSearchMethod<T> = (nome: string) => Observable<T[]>;

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent implements OnInit {
  isChange = false;
  destroy$ = new Subject<void>();
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
  ngOnDestroy(value: any) {
    this.destroy$.next(value);
    this.destroy$.complete();
  }

   listarEntidade<T>(
    control: FormControl,
    serviceMethod: ServiceSearchMethod<T>,
    errorMsg: string
  ) {
    if (control.valid) {
      const value = control.value;
      if (typeof value === 'string') {
        serviceMethod(value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          complete(): void {
          },
          next: (result: T[]) => {
            if (result.length > 0) {
              this.etapa = 2;
            } else {
              this.onError(errorMsg);
            }
          },
          error: (error: any) => {
            if (error.status === 404) {
              this.onError(`Erro ao buscar ${errorMsg}.`);
            }
          }
        });
      } else {
        this.etapa = 2;
      }
    }
  }

 listarClientes() {
    this.listarEntidade<ICliente>(
      this.clienteControl,
      (nome: string) => this.clienteService.getClientePorNome(nome),
      'Cliente não encontrado'
    );
  }

  listarFuncionario() {
    this.listarEntidade<IFuncionario>(
      this.funcionarioControl,
      (nome: string) => this.funcionarioServices.getFuncionarioPorNome(nome),
      'Funcionario não encontrado'
    );
  }

  verificarCliente() {
    this.listarClientes();
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.handleFilter(value, 'cliente')),
      takeUntil(this.destroy$)
    );
  }

  verificarFuncionario() {
    this.listarFuncionario();
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.handleFilter(value, 'funcionario')),
      takeUntil(this.destroy$)
    );
  }

  handleFilter(value: any, type: 'cliente' | 'funcionario'): Observable<any[]> {
   if (typeof value === 'string' && value.length >= 2  ) {
      return type === 'cliente'
        ? this.clienteService.getClientePorNome(value).pipe(
          catchError(() => {
            console.error('Erro ao buscar clientes');
            return of([]);
          })
        )
        : this.funcionarioServices.getFuncionarioPorNome(value).pipe(
        catchError(() => {
          console.error('Erro ao buscar funcionarios');
          return of([]);
        })
      )
    }
    return of([]);
  }

  displayFn(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

 displayFnFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
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

  save(os: iServiceOrder) {
    // Verifica se os campos obrigatórios estão preenchidos
    if (this.clienteControl.invalid || this.funcionarioControl.invalid) {
      this.onError('Preencha todos os campos obrigatórios');
      return;
    }
    // Obtém os valores dos controles
    const cliente: any = this.clienteControl.value ;
    const funcionario:any = this.funcionarioControl.value ;
    const dataAtual = new Date(); // Data atual
    // Atribui os valores à OS
    os.nomeCliente = cliente.nomeCliente;
    os.nomeFuncionario = funcionario.nomeFuncionario;
    os.dt_OS = dataAtual.toLocaleDateString('pt-BR');
  //  console.log('Os: ',os,)


  // Verifica se é uma edição ou criação nova
   if (this.isChange && os.idOS) {
      // Chama o método de atualização do serviço
      this.osServices.update(os.idOS,os).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (osAtualizada) => {
          this.dialogRef.close(osAtualizada);
        },
        error: (err) => {
          this.onError('Erro ao atualizar a OS');
          console.error(err);
        }
      });
    } else {
      // Chama o método de criação do serviço
     console.log('Criando OS', os)
      this.osServices.create(os).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (osCriada) => {
          this.dialogRef.close(osCriada);
        },
        error: (err) => {
          this.onError('Erro ao criar a OS');
          console.error(err);
        }
      });
    }
  }


  onError(message: string) {
    console.error(message);
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
