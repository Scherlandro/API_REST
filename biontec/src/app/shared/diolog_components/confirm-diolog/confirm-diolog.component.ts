import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-diolog',
  templateUrl: './confirm-diolog.component.html',
  styleUrls: ['./confirm-diolog.component.css']
})
export class ConfirmDiologComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
              public dialogRef: MatDialogRef<ConfirmDiologComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}

