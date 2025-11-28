import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUser} from "../../../interfaces/user";
import {iItensOS} from "../../../interfaces/itens-os";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../../../services/user.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-dialog-usuario',
  templateUrl: './dialog-usuario.component.html',
  styleUrls: ['./dialog-usuario.component.css']
})
export class DialogUsuarioComponent implements OnInit {
  isChange!: boolean;
  destroy$ = new Subject<void>();
  emailControl = new FormControl();
  passwordControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public iUser: IUser,
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogUsuarioComponent>
  ) {
  }


  ngOnInit(): void {
    if (this.iUser.id_usuario != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  save(user: IUser) {
    if (this.isChange ) {
      this.userService.editarUsuario(user)
        .pipe(takeUntil(this.destroy$)
        ).subscribe({
        next: (i) => {
          this.dialogRef.close(i);
        },
        error: (err) => {
          this.onError('Erro ao atualizar a OS');
          console.error(err);
        }
      });
    } else {
      this.userService.createUsuario(user).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (i) => {
          this.dialogRef.close(i);
        },
        error: (err) => {
          this.onError('Erro ao adicionar item');
          console.error(err);
        }
      });
    }
  }

// Método que valida se o botão "Salvar" deve ser habilitado
  isSaveButtonDisabled(): boolean {
    return !(this.emailControl.valid && this.passwordControl.valid);
  }

  onError(message: string): void {
    console.error(message);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
