import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { iItensVd } from 'src/app/interfaces/itens-vd';
import { ItensVdService } from 'src/app/services/itens-vd.service';

@Component({
  selector: 'app-dialog-editor-itens-os',
  templateUrl: './dialog-itens-os.component.html',
  styleUrls: ['./dialog-itens-os.component.css']
})
export class DialogItensOSComponent implements OnInit {
  isChange!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public itensVd: iItensVd,
    public dialogRef: MatDialogRef<DialogItensOSComponent>,
    public itensVdService: ItensVdService
  ) {}


  ngOnInit(): void {

    if (this.itensVd.idItensVd != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
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

