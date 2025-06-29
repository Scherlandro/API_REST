import { Component, OnInit } from '@angular/core';
import { iVendas } from 'src/app/interfaces/vendas';
import { VendasService } from 'src/app/services/vendas.service';

@Component({
  selector: 'app-c-index',
  templateUrl: './c-index.component.html',
  styleUrls: ['./c-index.component.css']
})
export class CIndexComponent implements OnInit {

  listaVendas: iVendas[] = []

  constructor(private vendasService: VendasService) { }

  ngOnInit(): void {
    this.vendasService.getAllSales().subscribe(
      data => {
        console.log(data)
        this.listaVendas = data
      }
    )
  }

  trash(id:number | undefined){
    console.log(id)
    this.vendasService.trashSales(id).subscribe(
      data => {
        console.log(data)
        this.ngOnInit()
    })
  }

  untrash(id:number | undefined){
    this.vendasService.untrashSales(id).subscribe(
      data => {
        console.log(data)
        this.ngOnInit()
    })
  }

 /*
 -------------------------------------
 export interface Cart {
    id: number,
    userId: number,
    date: string,
    products: Array<{productId: number, quantity: number}>,
    __v: number
}
-------------------------------------------------
  carts!: Cart[];

  displayedColumns: string[] = ['id','userId', 'date',  'products-id', 'products-quantity'];

  constructor(
    private cartsService: CartsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(response => this.cartsService.getCart(response.id)
    .subscribe(response => this.carts = response)
    );

  }
  */




}
