import {Component, Input, OnInit} from '@angular/core';
import {DistrictService} from "../../services/district.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit{

  nome = '';
  topHeadlinesData: any[]=[];
 // @Input() area : number;
  //nomeAgrupado : string = "E TAL";
  //sistemaService : SistemaService;
 // sistemas: Sistema[] = [];


   constructor(private districtservice: DistrictService,
            //   private activatedRoute : ActivatedRoute,
              // sistemaService : SistemaService
   ) {
    // this.sistemaService = sistemaService;
   }

  ngOnInit(): void {
     this.districtservice.topHeadlines().subscribe(res =>{
       console.log(res.results);
       this.topHeadlinesData = res.results;
     })

    /*
    console.log("Area Sistema :"+this.area);
    this.area = 3;
    this.nome = this.descricaoArea(this.area);
    this.exibeSist
     */

  }

  }

