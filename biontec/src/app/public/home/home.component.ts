import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {MensagemService} from "../../services/mensagem.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
@ViewChild('imgMain') imgMain!: ElementRef;
imgWidth:any=0; imgHeight:any=0;
zoom=2;
glassHeight=0;
glassWidth=0;
glass:any;
/*mensagens!: Observable<string> ;
mensagemService!: MensagemService;*/

  constructor(
              private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
  //this.getNotification() ;
  }
  onImageLoad(e: any){
  this.imgWidth=(this.imgMain.nativeElement as HTMLImageElement ).width;
  this.imgHeight=(this.imgMain.nativeElement as HTMLImageElement).height;
  }


}
