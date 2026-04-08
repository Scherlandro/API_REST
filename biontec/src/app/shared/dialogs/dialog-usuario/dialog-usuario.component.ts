import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUser} from "../../../interfaces/user";
import {iItensOS} from "../../../interfaces/itens-os";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserService} from "../../../services/user.service";
import {FormControl} from "@angular/forms";
import {WebcamImage, WebcamInitError} from "ngx-webcam";

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

  public showWebcam = false;
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 1024 },
    height: { ideal: 768 }
  };

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
    if (user.id_usuario != null ) {
      this.userService.editarUsuario(user)
        .pipe(takeUntil(this.destroy$)
        ).subscribe({
        next: (i) => {
          this.dialogRef.close(i);
        },
        error: (err) => {
          this.onError('Erro ao atualizar o Usuário');
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
          this.onError('Erro ao adicionar o Usuário');
          console.error(err);
        }
      });
    }
  }

  // Gatilho para tirar a foto
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.toggleWebcam(); // Fecha a câmera após tirar a foto
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    // Nesse caso pego a string Base64 e salvo no objeto que vai para o Java
    //Lembrete: O prefixo data:image/jpeg;base64, deve ser removido para o byte[] do Spring
    this.iUser.fotoUsuario = webcamImage.imageAsBase64 as any;
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Permissão de câmera negada");
    }
  }

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
