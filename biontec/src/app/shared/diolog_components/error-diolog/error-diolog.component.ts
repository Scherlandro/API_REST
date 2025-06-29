import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-error-diolog',
  templateUrl: './error-diolog.component.html',
  styleUrls: ['./error-diolog.component.css']
})
export class ErrorDiologComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }


}
