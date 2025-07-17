import { Component, Inject } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import { ErrorDiologComponent } from "../error-diolog/error-diolog.component";
import {ICliente} from "../../../interfaces/cliente";
import {debounceTime, distinctUntilChanged, Observable, of, switchMap} from "rxjs";
import {ClienteService} from "../../../services/cliente.service";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent {
  isChange = false;
  osSelecionada!: iServiceOrder;
  clienteControl = new FormControl('', [Validators.required]);
  clientesFiltrados: Observable<ICliente[]>;
  clientes: ICliente[] = [];
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public os: iServiceOrder,
    public dialogRef: MatDialogRef<DialogOpenOsComponent>,
    public osServices: OrdemDeServicosService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adiciona delay para evitar muitas requisições
      distinctUntilChanged(), // Só emite se o valor mudou
      switchMap(value => {
        if (typeof value === 'string') {
          return this.filtrarClientes(value);
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit(): void {
    // Carrega clientes iniciais se necessário
  }

  private filtrarClientes(nome: string): Observable<ICliente[]> {
    if (nome.length < 2) {
      return of([]); // Não busca para poucos caracteres
    }
    return this.clienteService.getClientePorNome(nome).pipe(
      catchError(() => of([])) // Trata erros retornando array vazio
    );
  }

  displayFn(cliente: ICliente): string {
    return cliente && cliente.nomeCliente ? cliente.nomeCliente : '';
  }

  listarClientes() {
    if (this.clienteControl.valid) {
      const value = this.clienteControl.value;
      if (typeof value === 'string') {
        this.clienteService.getClientePorNome(value).subscribe(
          (result: ICliente[]) => {
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

  onError(message: string) {
    // Implemente sua lógica de exibição de erro aqui
    console.error(message);
  }

  onCancel() {
    this.dialogRef.close();
  }

  save(os: iServiceOrder) {
    // Implemente sua lógica de salvamento aqui
  }

  /*
    private _filtrarClientes(nome: string): any  {
    return this.clienteService.getClientePorNome(nome);
  }


  changeCliente2(value: any) {
     console.log('digitado', value)
     if (value) {
       this.clientesFiltrados = this.clienteSelecionado
         .filter((o:any) => o.toUpperCase().includes(value.toUpperCase()));
     } else {
       this.clientesFiltrados = this.clienteSelecionado;
     }
   }

      _filter(value: any): any[] {
         const filterValue = value.toLowerCase();
         return this.clientes.filter(option => option.nomeCliente.includes(filterValue));
       }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.clienteControl.getRawValue().filter = valor;
  }

  displayFn(cliente: ICliente): string {
    return cliente && cliente.nomeCliente ? cliente.nomeCliente : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selecionarCliente(): void {
    this.dialogRef.close(this.clienteSelecionado);
  }

  save(os: any){
    console.log('Itens a adicionar', os)
    this.osServices.create(os);
  }

  formatter(value: number): string {
    //<div>{{ formatter(iProdroduto.valor_venda) }}</div>
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  statusDaOS(){
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }
*/

  }
