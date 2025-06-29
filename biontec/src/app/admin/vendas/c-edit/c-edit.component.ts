import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendasService } from 'src/app/services/vendas.service';
import { iVendas} from '../../../interfaces/vendas';

@Component({
  selector: 'app-c-edit',
  templateUrl: './c-edit.component.html',
  styleUrls: ['./c-edit.component.css']
})
export class CEditComponent implements OnInit {

/*  cocktail: iVendas = {
    id: 0,
    user_id: 0,
    nom: '',
    description: '',
    recette: '',
    updatedAt: '',
    createdAt: '',
    deletedAt: null
  }*/
  constructor(
    private activated: ActivatedRoute,
    private cocktailService: VendasService
  ) { }

  ngOnInit(): void {
    let cid = this.activated.snapshot.paramMap.get('id')
    console.log(cid)
/*    this.cocktailService.getCocktail(cid).subscribe(
      data => {
        console.log(data)
        this.cocktail = data.data
      }
    )*/
  }

  onSubmit(){
   /* this.cocktailService.updateCocktail(this.cocktail).subscribe(
      data => console.log(data.message)
    )*/
  }

}
