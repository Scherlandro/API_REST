import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {VendasService} from "../../../services/vendas.service";
import {catchError, map, startWith} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, Observable, of, switchMap} from "rxjs";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";
import {each} from "chart.js/dist/helpers";
import {ICliente} from "../../../interfaces/cliente";
import {ClienteService} from "../../../services/cliente.service";
import {iServiceOrder} from "../../../interfaces/service-order";
import {iVendas} from "../../../interfaces/vendas";

@Component({
  selector: 'app-dialog-open-sales',
  templateUrl: './dialog-open-sales.component.html',
  styleUrls: ['./dialog-open-sales.component.css']
})
export class DialogOpenSalesComponent {
  isChange!: boolean;
  cli!: ICliente;
  clienteControl = new FormControl('', [Validators.required]);
  clientesFiltrados: Observable<ICliente[]>;
  clientes: ICliente[] = [];
  listProd: any;
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public venda: iVendas,
    public dialogRef: MatDialogRef<DialogOpenSalesComponent>,
    public vendaServices: VendasService,
    public dialog: MatDialog,
    public clienteService: ClienteService,
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

  verificarStatus(){
    if (this.venda.idVenda != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save():void{
    //this.clienteServices.createElements(this.iCliente);
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
