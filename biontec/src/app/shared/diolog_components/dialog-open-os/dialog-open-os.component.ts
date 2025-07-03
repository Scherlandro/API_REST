import { Component, Inject } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import { iProduto } from "../../../interfaces/product";
import { ProductService } from "../../../services/product.service";
import { ErrorDiologComponent } from "../error-diolog/error-diolog.component";

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent {
  isChange=true;
  prod!: iProduto;
  produtoControl = new FormControl();
  listProd: any;
  produtosFiltered!:string[];
  products!: string[] ;
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public os: iServiceOrder,
    public dialogRef: MatDialogRef<DialogOpenOsComponent>,
    public osServices: OrdemDeServicosService,
    public prodService: ProductService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
   this.statusDaOS();
   // this.listarProdutos();
  //  this.produtosFiltered = this.produtoControl.valueChanges.pipe( startWith(''), map(value => value._filter(value) ) )
 //   https://v5.material.angular.io/components/autocomplete/examples
  }
  statusDaOS(){
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  listarProdutos(value:any) {
	     if (this.produtoControl.valid) {
      this.prodService.listarProdutoPorNome(value).subscribe(
        (result:any) => {
          let re = result.map((i:any)=>i.nomeProduto.toString());
          this.products = re;
          this.produtosFiltered = re;
          console.log('lista produtos digitado', re)
          this.etapa = 2;
        },
        error => {
          if (error.status === 404) {
             this.onError('Erro ao buscar produto.')
          }
        }
      );
    }
 /*   this.prodService.getTodosProdutos()
      .pipe(catchError(error => { this.onError('Erro ao buscar produto.') return of([])
      }))
      .subscribe((rest: IProduto[]) => { this.products = rest  });*/
  }

  changeProdutos(value: any) {
    console.log('digitado', value)
  //  this.listarProdutos(value)
    if (value) {
      this.produtosFiltered = this.products.filter(o => o.toUpperCase().includes(value.toUpperCase()));
    } else {
      this.produtosFiltered = this.products;
    }
  }

  /*
     _filter(value: any): any[] {
      const filterValue = value.toLowerCase();
      return this.products.filter(option => option.nome_produto.includes(filterValue));
    }
  */

/*
  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.produtoControl.getRawValue().filter = valor;
  }
*/


  onCancel(): void {
    this.dialogRef.close();
  }

  save():void{
    //this.productServices.createElements(this.iProduto);
  }

  formatter(value: number): string {
    //<div>{{ formatter(iProdroduto.valor_venda) }}</div>
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
