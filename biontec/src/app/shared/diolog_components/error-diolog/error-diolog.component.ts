import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-error-diolog',
  templateUrl: './error-diolog.component.html',
  styleUrls: ['./error-diolog.component.css']
})
export class ErrorDiologComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              public dialogRef: MatDialogRef<ErrorDiologComponent>) { }

  ngOnInit(): void {
  }
  closeDialog() {
    this.dialogRef.close(false);
  }


}
