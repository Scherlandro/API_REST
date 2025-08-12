import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PurchaseStateService {
  private total = 0;
  private cartCount$ = new Subject<number>();
  public search = new BehaviorSubject<string>("");
  private selectedProductId = new BehaviorSubject<number | null>(null);
  private startSellingSelectedProduct = new BehaviorSubject<any>(null);
  constructor() { }

  setSelectedProduct(id: number) {
    this.selectedProductId.next(id);
    // Armazena também no localStorage para persistência
    localStorage.setItem('selectedProductId', id.toString());
  }

  getSelectedProduct() {
    // Verifica se há um ID no localStorage (útil se a página for recarregada)
    const storedId = localStorage.getItem('selectedProductId');
    if (storedId && !this.selectedProductId.value) {
      this.selectedProductId.next(Number(storedId));
    }
    return this.selectedProductId.asObservable();
  }

  clearSelectedProduct() {
    this.selectedProductId.next(null);
    localStorage.removeItem('selectedProductId');
  }

  startSaleOfSelectedProduct(idUsuario: number, idProduto: number) {
    const starSale = [idUsuario,idProduto];
    this.startSellingSelectedProduct.next(starSale);
    // Armazena também no localStorage para persistência
    //localStorage.setItem('selectedProductId', idProduto.toString());
    localStorage.setItem('startSaleOfSelectedProduct', starSale.toString());
  }

  getSaleOfSelectedProduct() {
    // Verifica se há um ID no localStorage (útil se a página for recarregada)
    const storedId = localStorage.getItem('startSaleOfSelectedProduct');
    if (storedId && !this.startSellingSelectedProduct.value) {
      this.startSellingSelectedProduct.next(Number(storedId));
    }
    return this.startSellingSelectedProduct.asObservable();
  }

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
