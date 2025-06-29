import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUser} from "../../../interfaces/user";

@Component({
  selector: 'app-dialog-usuario',
  templateUrl: './dialog-usuario.component.html',
  styleUrls: ['./dialog-usuario.component.css']
})
export class DialogUsuarioComponent implements OnInit {

  isChange!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public iUser: IUser,
    public dialogRef: MatDialogRef<DialogUsuarioComponent>
  ) {}


  ngOnInit(): void {
    if (this.iUser.id_usuario != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
