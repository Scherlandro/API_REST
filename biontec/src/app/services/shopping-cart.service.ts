import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private total = 0;
  private cartCount$ = new Subject<number>();
  public search = new BehaviorSubject<string>("");

  constructor() { }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  addProduct(): void {
    this.total++;
    this.updateCart();
  }

  checkout(): void {
    this.total = 0;
    this.updateCart();
  }

  private updateCart(): void {
    this.cartCount$.next(this.total);
  }

/*
  private getBaseCauculo(cart: any): any {
    switch (cart) {
      case this.total:
        return this.total;
      case this.cartCount$:
        return this.cartCount$;
    }
  }
 */

}
