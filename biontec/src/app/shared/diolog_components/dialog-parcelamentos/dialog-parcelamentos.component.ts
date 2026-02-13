import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Parcela {
  numero: number;
  vencimento: Date;
  valor: number;
}

@Component({
  selector: 'app-dialog-parcelamentos',
  templateUrl: './dialog-parcelamentos.component.html',
  styleUrls: ['./dialog-parcelamentos.component.css']
})
export class DialogParcelamentosComponent implements OnInit {
  parcelaForm: FormGroup;
  dataSource: Parcela[] = [];
  displayedColumns: string[] = ['numero', 'vencimento', 'valor'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogParcelamentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.parcelaForm = this.fb.group({
      valorTotal: [data || 0],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      dataPrimeiraParcela: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {}

  calcularParcelas() {
    if (this.parcelaForm.invalid) return;

    const { valorTotal, quantidade, dataPrimeiraParcela } = this.parcelaForm.value;
    const valorCadaParcela = valorTotal / quantidade;
    const parcelas: Parcela[] = [];

    for (let i = 0; i < quantidade; i++) {
      const dataVencimento = new Date(dataPrimeiraParcela);
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      parcelas.push({
        numero: i + 1,
        vencimento: dataVencimento,
        valor: valorCadaParcela
      });
    }

    this.dataSource = parcelas;
  }
}
