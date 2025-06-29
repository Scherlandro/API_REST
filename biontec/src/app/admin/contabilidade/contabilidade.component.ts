import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import {ProductService} from "../../services/product.service";
import {iProduto} from "../../interfaces/product";
import {interval, Observable, of, Subscription, timeout} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {catchError} from "rxjs/operators";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {MatDialog} from "@angular/material/dialog";
import { FormControl } from '@angular/forms';
import {ItensVdService} from "../../services/itens-vd.service";
import {iItensVd} from "../../interfaces/itens-vd";


@Component({
  selector: 'app-contabilidade',
  templateUrl: './contabilidade.component.html',
  styleUrls: ['./contabilidade.component.css']
})
export class ContabilidadeComponent implements OnInit {
  date_init:any;
  date_finish: any;
  resultDate: any;
  aSub!: Subscription
  @ViewChild('canvasElement', {static: true}) canvasElement!: ElementRef;
  restDate= new MatTableDataSource<iProduto>() ;
  restDtItens: any[]=[];

  constructor( private itensVD: ItensVdService,
               public dialog: MatDialog ) {  }

  ngOnInit(): void {
    //this.listarItensDaVenda();
  }

  mostarGrafico(){
    this.listarItensDaVenda();
    setTimeout(()=>(this.startGrafics()),200);
  }

  listarItensDaVenda() {
    let dtInt = this.date_init.split('-').reverse().join('/');
    let dtFin = this.date_finish.split('-').reverse().join('/');
    this.itensVD.getItensVdEntreDatas(dtInt, dtFin)
      .subscribe(  (data: iItensVd[]) => {
        this.restDtItens = data;
      });
  }

  startGrafics() {
    new Chart(this.canvasElement.nativeElement, {
      type: "line",
      options: {
        responsive: true,
      },
      data: {
        labels: ["Jan", "Feb", "Marc", "Apr", "Mai", "Jun", "Jul", "Agos", "Set", "Oct", "Nov", "Dec"],
        datasets: [
        {
            borderColor:'rgb(54, 162, 235)',
            data: [4,20,80,7, 22, 30,10,23,50,14,7,60],
            label:'Peditos',
            borderWidth:3,
            backgroundColor:'rgba(21,79,165,0.27)',
            fill:true
          },
          {
            borderColor:'rgb(235,105,54)',
            data: this.restDtItens.map((i:iItensVd)=>i.qtd_vendidas),
            label:'Itens das Vendas',
            borderWidth:3,
            backgroundColor:'rgba(21,79,165,0.27)',
            fill:true
          }

        ]
      }
    }).data.datasets;
  }


  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }


  /*

  selected = new Date() ;
  resultHour = new Date();
  hourString = '';
  formDate = new FormControl();

    getDay(){
      let day = this.selected.getDate().toString();
      day = day.length === 1 ? `0${day}` : day;
      let month =  (this.selected.getMonth()+1).toString() ;
      month = month.length === 1 ? `0${month}` : month;
      let hour2 = this.resultHour.getHours();
      let hour = this.resultHour.toLocaleTimeString('en-US', { hour12: false }).slice(0,5);
      let hour = this.resultHour.toLocaleTimeString('en-US');
      let dataFormat = (this.selected.getFullYear() + "-" + (month) + "-" + (day)) ;
      this.listEventByDataDay(dataFormat);
      var newHour = hour2 >= 12 ? (hour2 % 12) + ' PM' : hour2 + ' AM' ;
      this.resultDate = `${day}`+` at `+`${newHour}`;
      this.hourString = newHour;

    let initMonth = this.date_init.toString().slice(5,7);
    let finishMonth = this.date_finish.toString().slice(5,7);
    console.log('Hour without minutes -->  '+this.hourString);
    var resutDate = Math.abs(this.date_finish - this.date_init);
    var diff = Math.ceil(resutDate/ (1000 * 3600 * 24))
    let qtd_period = this.restDate;//.data.map((i:IProduto)=>i.dt_cadastro );
      alert(finishMonth-initMonth);
    console.log('Resut de diff-->  ', qtd_period);
  }

  listEventByDataDay(dt_day:any){
  this.eventService.getEventByDataDay(dt_day).subscribe( (result: IEvents[]) => {  this.tbSourceEvents$.data = result;
          if(result.toString() == ''){
            let h = this.resultHour.toLocaleTimeString('en-US').slice(0,5).split('' ,11);
             alert(h);
             alert('This day --'+ this.resultDate + '  --There is not shedule for this day!')
              this.onMessage(' There is no schedule for this day.');
          }
        });
  }


  chosenYearHandler(normalizedYear: Date) {
    const ctrlValue = this.formDate.value;
    ctrlValue.year(normalizedYear.getFullYear());
    this.formDate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Date) {
    const ctrlValue = this.formDate.value;
    ctrlValue.month(normalizedMonth.getMonth());
    this.formDate.setValue(ctrlValue);
  }
*/

}
