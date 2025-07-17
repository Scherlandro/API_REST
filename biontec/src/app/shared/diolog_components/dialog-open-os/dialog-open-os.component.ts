import { Component, Inject } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import { ErrorDiologComponent } from "../error-diolog/error-diolog.component";
import {ICliente} from "../../../interfaces/cliente";
import {Observable, of} from "rxjs";
import {ClienteService} from "../../../services/cliente.service";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent {
  isChange=false;
  osSelecionada!: iServiceOrder;
  clienteControl = new FormControl();
//  clientesFiltrados: Observable<ICliente[]>;
  clientesFiltrados: ICliente[] = [];
  clienteSelecionado:  ICliente[] = [];
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
   /* this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nome),
      map(nome => nome ? this._filtrarClientes(nome) : [])
    );*/
  }

  private _filtrarClientes(nome: string): any  {
    return this.clienteService.getClientePorNome(nome);
  }

  displayFn(cliente: ICliente): string {
    return cliente && cliente.nome_cliente ? cliente.nome_cliente : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selecionarCliente(): void {
    this.dialogRef.close(this.clienteSelecionado);
  }


  ngOnInit(): void {
   this.statusDaOS();
  }


    statusDaOS(){
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

    listarClientes(value:any) {
         if (this.clienteControl.valid) {
        this.clienteService.getClientePorNome(value).subscribe(
          (result:any) => {
            let re = result.map((i:any)=>i.nomeCliente.toString());
          //  this.clientes = re;
          //  this.clientesFiltered = re;
            console.log('lista clientes digitado', re)
            this.etapa = 2;
          },
          error => {
            if (error.status === 404) {
               this.onError('Erro ao buscar cliente.')
            }
          }
        );
      }
/*    this.clienteService.getTodosClientes()
        .pipe(catchError(error => { this.onError('Erro ao buscar cliente.') return of([])
        }))
        .subscribe((rest: ICliente[]) => { this.clienteSelecionado = rest  });*/
  }
  changeCliente(value: any) {
    if (value) {
      this.clientesFiltrados = this.clienteSelecionado.filter(c => c.nome_cliente.toUpperCase().includes(value.toUpperCase()));
    } else {
      this.clientesFiltrados = this.clienteSelecionado;
    }
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

  /*   _filter(value: any): any[] {
        const filterValue = value.toLowerCase();
        return this.clientes.filter(option => option.nome_cliente.includes(filterValue));
      }*/

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.clienteControl.getRawValue().filter = valor;
  }

  save(os: any){
    console.log('Itens a adicionar', os)
    this.osServices.create(os);
  }

  formatter(value: number): string {
    //<div>{{ formatter(iProdroduto.valor_venda) }}</div>
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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


  }
