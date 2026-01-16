import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { iItensVd } from 'src/app/interfaces/itens-vd';
import { ItensVdService } from 'src/app/services/itens-vd.service';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {IFuncionario} from "../../../interfaces/funcionario";
import {ICliente} from "../../../interfaces/cliente";
import {iVendas} from "../../../interfaces/vendas";

@Component({
  selector: 'app-dialog-editor-itvd',
  templateUrl: './dialog-itensvd.component.html',
  styleUrls: ['./dialog-itensvd.component.css']
})
export class DialogItensVdComponent implements OnInit {
  isChange!: boolean;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  clientesFiltrados!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);

  venda!:iVendas;


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public itensVd: iItensVd,
    public dialogRef: MatDialogRef<DialogItensVdComponent>,
    public itensVdService: ItensVdService
  ) {}


  ngOnInit(): void {

    if (this.itensVd.idItensVd != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  displayFn(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
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


}

