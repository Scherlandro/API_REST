import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { iProduto } from "../../../interfaces/product";
import { ProductService } from "../../../services/product.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-dialog-editor',
  templateUrl: './dialog-produto.component.html',
  styleUrls: ['./dialog-produto.component.css']
})

export class DialogProdutoComponent implements OnInit {
  isChange!: boolean;
  fieldStates = {
    valorCompra: { isEdit: false },
    valorVenda: { isEdit: false }
  };
  imagePreview: string | ArrayBuffer | null = null;
  destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public produto: iProduto,
    public dialogRef: MatDialogRef<DialogProdutoComponent>,
    public productServices: ProductService
  ) {}

  ngOnInit(): void {
    if (this.produto.idProduto != null) {
      this.isChange = false;
      this.fieldStates.valorCompra.isEdit = false;
      this.fieldStates.valorVenda.isEdit = false;
    } else {
      this.isChange = true;
      this.fieldStates.valorCompra.isEdit = true;
      this.fieldStates.valorVenda.isEdit = true;
    }

    // Se estiver editando e já existir foto, carrega o preview
    if (this.produto.fotoProduto) {
      this.imagePreview = 'data:image/jpeg;base64,' + this.produto.fotoProduto;
    }

    console.log('produto', this.produto.idProduto, 'fieldStates', this.fieldStates);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save(prod: iProduto) {
    if (prod.idProduto != null ) {
      this.productServices.editElement(prod)
        .pipe(takeUntil(this.destroy$)
        ).subscribe({
        next: (i) => {
          this.dialogRef.close(i);
        },
        error: (err) => {
          this.onError('Erro ao atualizar o Produto');
          console.error(err);
        }
      });
    } else {
      this.productServices.createElements(prod).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (i) => {
          this.dialogRef.close(i);
        },
        error: (err) => {
          this.onError('Erro ao adicionar o Produto');
          console.error(err);
        }
      });
    }
  }

  edite(prod:iProduto){
    console.log('Prod para atualizar', prod)
    this.productServices.editElement(prod);
  }

  calcularPrecoVenda(): void {
    const valorCompra = Number(this.produto.valorCompra);
    const percentual = Number(this.produto.percentual);
    if (!isNaN(valorCompra) && !isNaN(percentual)) {
      const margem = valorCompra * (percentual / 100);
      const resultado = valorCompra + margem;

      // Usamos o Number() em volta do toFixed porque o toFixed retorna uma string
      this.produto.valorVenda = Number(resultado.toFixed(2));

      console.log('Cálculo realizado:', {
        compra: valorCompra,
        percent: percentual,
        venda: this.produto.valorVenda
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // O resultado do FileReader contém o prefixo "data:image/jpeg;base64,"
        const fullBase64 = reader.result as string;
        this.imagePreview = fullBase64;

        // Para o banco de dados (byte[]), precisamos apenas da string base64 pura
        // Removemos o prefixo "data:image/...;base64,"
        this.produto.fotoProduto = fullBase64.split(',')[1] as any;
      };

      reader.readAsDataURL(file);
    }
  }

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  onError(message: string): void {
    console.error(message);
  }

}

