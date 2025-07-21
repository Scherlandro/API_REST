import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { iItensVd } from 'src/app/interfaces/itens-vd';
import { ItensVdService } from 'src/app/services/itens-vd.service';
import {iProduto} from "../../../interfaces/product";
import {FormControl, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {Observable, of,pipe} from "rxjs";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-dialog-editor-itens-os',
  templateUrl: './dialog-itens-os.component.html',
  styleUrls: ['./dialog-itens-os.component.css']
})
export class DialogItensOSComponent implements OnInit {
  isChange!: boolean;
  produtoFiltered: iProduto[]=[];
  products: iProduto[]=[];
  produtoControl: FormControl;


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public itensVd: iItensVd,
    public dialogRef: MatDialogRef<DialogItensOSComponent>,
    public itensVdService: ItensVdService,
    private prodService: ProductService,
  ) {
    this.produtoControl = new FormControl(null, [Validators.required])
  }


  ngOnInit(): void {
    this.listarProdutos();
    if (this.itensVd.idItensVd != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  listarProdutos() {
    this.prodService.getTodosProdutos()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar produto.')
        return of([])
      }))
      .subscribe((rest: iProduto[]) => {
        this.produtoFiltered= rest;
        this.products = rest;
      });
  }
/*

  listarProdutosString() {
    this.prodService.getAll()
      .pipe(catchError(error => {
        this.onError('Erro ao buscar produto.')
        return of([])
      }))
      .subscribe((rest: any[]) => {
        this.products = rest ;
        this.produtoFiltered = rest;
      });
  }
*/


    displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }


  onError(message: string) {
    console.error(message);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save():void{
    this.itensVdService.createElements(this.itensVd);
  }

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }


  changeProduto(value: any) {
    if (value) {
      this.produtoFiltered = this.products.filter(
        produto => produto.nomeProduto.toUpperCase()
          .includes(value.toUpperCase()));
    } else {
      this.produtoFiltered = this.products;
    }
  }
}

