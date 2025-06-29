import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from "../../services/auth.service";
//import Swiper, { EffectCube, Pagination } from "@angular/swiper";
//import Swiper from "@angular/swiper";
import {getTemplateId} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
// install swiper modules
//Swiper.use([EffectCube, Pagination]);

@Component({
  selector: 'app-pheader',
  templateUrl: './pheader.component.html',
  styleUrls: ['./pheader.component.scss'] ,
  encapsulation:ViewEncapsulation.None,
})
export class PheaderComponent implements OnInit {
  title = 'biontec';
  menuItens:any[]=[];
  mostrarMenuPublico: boolean = false;

  constructor(
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.mostrarMenuEmitter.subscribe(
      mostrar => this.mostrarMenuPublico = mostrar
    );
  }

}
