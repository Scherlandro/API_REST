import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCalendar} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {IUser} from "../../interfaces/user";
import {DialogUsuarioComponent} from "../../shared/diolog_components/dialog-usuario/dialog-usuario.component";
import {MensagemService} from "../../services/mensagem.service";
import {Observable} from "rxjs";
import {NotificationMgsService} from "../../services/notification-mgs.service";


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
export interface IEvent{

}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  events = new FormControl();
  mensagens!: Observable<string>  ;


  constructor(private mensagemService: MensagemService,
              public notificationMsg:  NotificationMgsService
              ) { }

  ngOnInit(): void {  }

  showNotification(){
    this.notificationMsg.openConfirmDialog('Hello')
      .afterClosed().subscribe(res =>{
        if (res){
          this.notificationMsg.openConfirmDialog("Beleza");
        }
    });
   // this.mensagens = this.mensagemService.getNotification();
    /*   this.mensagemService.getMensagens().subscribe((mensagem) => this.mensagens.push(mensagem)  );*/
  }

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: '#413968'},
    {text: 'Two', cols: 1, rows: 2, color: 'rgba(21,99,97,0.66)'},
    {text: 'Three', cols: 1, rows: 1, color: '#5e0d4a'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });

/*
listEvents(event: string )
{
  this.events = ()[
    {
     event.start: new FormControl((new Date()), 1),
      end: new FormControl(new Date(), 1),
      title: 'A 3 day event',
      color: {...colors['red']},
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
      {
        start: startOfDay(new Date()),
        title: 'An event with no end date',
        color: {...colors['yellow']},
        actions: this.actions,
      },
      {
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        color: {...colors['blue']},
        allDay: true,
      },
      {
        start: addHours(startOfDay(new Date()), 2),
        end: addHours(new Date(), 2),
        title: 'A draggable and resizable event',
        color: {...colors['yellow']},
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      }
    ]
}

*/

}
