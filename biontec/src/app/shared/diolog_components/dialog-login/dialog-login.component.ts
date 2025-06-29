import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUser} from "../../../interfaces/user";

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit {
  isChange!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataLogin: IUser,
    public dialogRef: MatDialogRef<DialogLoginComponent>,
  ) {}


  ngOnInit(): void {
   this.dialogRef.close();
    /*
    if (this.dataLogin.nome_usuario != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }

    */
  }


  onCancel(): void {
    this.dialogRef.close();
  }


}
