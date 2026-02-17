import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ErrorStateMatcher} from "@angular/material/core";
import {AbstractControl, FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {ConfirmDiologComponent} from "../shared/dialogs/confirm-diolog/confirm-diolog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {ErrorDiologComponent} from "../shared/dialogs/error-diolog/error-diolog.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationMgsService implements ErrorStateMatcher {

  apiError = new Subject<string>();

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  }

  constructor( public dialog:MatDialog, private snackBar: MatSnackBar ) {
  }

  sendError(message: string): void {
    this.apiError.next(message)
  }

  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openConfirmDialog(msg: string) {
    return this.dialog.open(ConfirmDiologComponent, {
      width: '340px',
      height:'150px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: {top: "100px"},
      data: {
        message: msg
      }
    });
  }

  success(msg:any) {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

/*  warn(msg:any) {
    this.config['panelClass'] = ['notification', 'warn'];
    this.snackBar.open(msg, '', this.config);
  }*/


  warn(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: ['warn-snackbar']
    });
  }


  sessionExpired(msg:any){
     this.dialog.open(ErrorDiologComponent, {
      panelClass: 'warn',
      disableClose: true,
      position: {top: "200px"},
      data: {
        message: msg
      }
    });
  }

}
