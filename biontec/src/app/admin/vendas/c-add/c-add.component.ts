import {Component, NgModule, OnInit} from '@angular/core';
import { iVendas } from 'src/app/interfaces/vendas';
import { VendasService } from 'src/app/services/vendas.service';
import { TokenService } from 'src/app/services/token.service';



@Component({
  selector: 'app-c-add',
  templateUrl: './c-add.component.html',
  styleUrls: ['./c-add.component.css']
})
export class CAddComponent implements OnInit {

/*
  cocktail: iVendas = {
    user_id: 0,
    nom: '',
    description: '',
    recette: '',
  }
*/

  constructor(
    private cocktailService: VendasService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let u = this.tokenService.getPayload()
  //  this.cocktail.user_id = u.id

  /*  this.cocktailService.addCocktail(this.cocktail).subscribe(
      data => console.log(data.message)
    )*/
  }


}
