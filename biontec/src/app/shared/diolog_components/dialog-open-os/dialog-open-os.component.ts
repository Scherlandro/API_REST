import {Component, Inject, OnInit} from '@angular/core';
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
export class DialogOpenOsComponent implements OnInit {
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
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value:any) => {
        if (typeof value === 'string') {
          return this.filtrarClientes(value);
        } else if (value && value.nomeCliente) {
          // Se for um objeto cliente (selecionado no autocomplete)
          return of([value]);
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit(): void {
    this.listarClientes();
  }

  private filtrarClientes(nome: string): Observable<ICliente[]> {
    if (nome.length < 2) {
      return of([]);
    }
    return this.clienteService.getClientePorNome(nome).pipe(
      catchError(() => {
        console.error('Erro ao buscar clientes');
        return of([]);
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
    // Implemente sua lógica de salvamento aqui
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }

  /*
  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.clienteControl.getRawValue().filter = valor;
  }
*/

  }
