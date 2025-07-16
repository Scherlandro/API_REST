import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {VendasService} from "../../../services/vendas.service";
import {catchError, map, startWith} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";
import {each} from "chart.js/dist/helpers";
import {ICliente} from "../../../interfaces/cliente";
import {ClienteService} from "../../../services/cliente.service";
import {iServiceOrder} from "../../../interfaces/service-order";

@Component({
  selector: 'app-dialog-open-sales',
  templateUrl: './dialog-open-sales.component.html',
  styleUrls: ['./dialog-open-sales.component.css']
})
export class DialogOpenSalesComponent {
  isChange!: boolean;
  cli!: ICliente;
  clienteControl = new FormControl();
  listProd: any;
  clienteFiltered!:string[];
  clientes!:string[];
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public os: iServiceOrder,
    public dialogRef: MatDialogRef<DialogOpenSalesComponent>,
    public vendaServices: VendasService,
    public clienteService: ClienteService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }

   // this.clienteFiltered = this.clienteControl.valueChanges.pipe( startWith(''), map(value => value._filter(value) ) )

 //   https://v5.material.angular.io/components/autocomplete/examples
  }

  listarClientes(value:any) {
	     if (this.clienteControl.valid) {
      this.clienteService.getClientePorNome(value).subscribe(
        (result:any) => {
          let re = result.map((i:any)=>i.nomeCliente.toString());
          this.clientes = re;
          this.clienteFiltered = re;
          console.log('lista cliente digitado', re)
          this.etapa = 2;
        },
        error => {
          if (error.status === 404) {
             this.onError('Erro ao buscar cliente.')
          }
        }
      );
    }
 /*   this.prodService.getTodosClientes()
      .pipe(catchError(error => { this.onError('Erro ao buscar cliente.') return of([])
      }))
      .subscribe((rest: ICliente[]) => { this.products = rest  });*/
  }

  changeCliente(value: any) {
    console.log('digitado', value)
    if (value) {
      this.clienteFiltered = this.clientes.filter(o => o.toUpperCase().includes(value.toUpperCase()));
    } else {
      this.clienteFiltered = this.clientes;
    }
  }

  /*
     _filter(value: any): any[] {
      const filterValue = value.toLowerCase();
      return this.products.filter(option => option.nome_cliente.includes(filterValue));
    }
  */

/*
  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.clienteControl.getRawValue().filter = valor;
  }
*/


  onCancel(): void {
    this.dialogRef.close();
  }

  save():void{
    //this.clienteServices.createElements(this.iCliente);
  }

  formatter(value: number): string {
    //<div>{{ formatter(iCliente.valor_venda) }}</div>
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
