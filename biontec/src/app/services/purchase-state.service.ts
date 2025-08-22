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
  private selectedProductsIds = new BehaviorSubject<number[]>([]);
  private startSellingSelectedProduct = new BehaviorSubject<any>(null);
  private startSellingSelectedProducts = new BehaviorSubject<any>(null);

  constructor() { }


  // Adiciona um produto à lista (evita duplicatas)
  addSelectedProduct(id: number) {
    const currentIds = this.selectedProductsIds.value;
    if (!currentIds.includes(id)) {
      const newIds = [...currentIds, id];
      this.selectedProductsIds.next(newIds);
      localStorage.setItem('selectedProductsIds', JSON.stringify(newIds));
      console.log('Produto adicionado ao carrinho. IDs atuais:', newIds);
    } else {
      console.log('Produto já está no carrinho:', id);
    }
  }

  // Remove um produto da lista
  removeSelectedProduct(id: number) {
    const currentIds = this.selectedProductsIds.value;
    const newIds = currentIds.filter(productId => productId !== id);
    this.selectedProductsIds.next(newIds);
    localStorage.setItem('selectedProductsIds', JSON.stringify(newIds));
    console.log('Produto removido do carrinho. IDs atuais:', newIds);
  }

  // Obtém todos os produtos selecionados
  getSelectedProducts() {
    const storedIds = localStorage.getItem('selectedProductsIds');
    if (storedIds) {
      const idsArray = JSON.parse(storedIds);
      if (idsArray.length > 0 && this.selectedProductsIds.value.length === 0) {
        this.selectedProductsIds.next(idsArray);
      }
    }
    return this.selectedProductsIds.asObservable();
  }

  // Limpa todos os produtos selecionados
  clearSelectedProducts() {
    this.selectedProductsIds.next([]);
    localStorage.removeItem('selectedProductsIds');
  }

  // Inicia a venda com múltiplos produtos
  startSaleOfSelectedProduct(userName: string, productIds: number[]) {
  var prodId: number | null;
   if(productIds.length == 0){
     prodId = this.selectedProductId.value;
   }else {
     prodId = productIds[0];
   }
     const startSale = {
       userName: userName,
       productIds: prodId
     };
  this.startSellingSelectedProducts.next(startSale);
    localStorage.setItem('startSaleOfSelectedProduct', JSON.stringify(startSale));
 }

  // Obtém os dados da venda iniciada
  getSaleOfSelectedProduct() {
    const storedSale = localStorage.getItem('startSaleOfSelectedProduct');
    if (storedSale) {
      const saleData = JSON.parse(storedSale);
      if (saleData && !this.startSellingSelectedProducts.value) {
        this.startSellingSelectedProducts.next(saleData);
      }
    }
    return this.startSellingSelectedProducts.asObservable();
  }

  // Limpa os dados da venda
  clearSaleData() {
    this.startSellingSelectedProducts.next(null);
    localStorage.removeItem('startSaleOfSelectedProduct');
  }

  // Métodos auxiliares para gerenciar o carrinho
  getCartCount() {
    return this.selectedProductsIds.value.length;
  }
 /* getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }
*/

  isProductInCart(productId: number): boolean {
    return this.selectedProductsIds.value.includes(productId);
  }

  setSelectedProduct(id: number) {
    this.selectedProductId.next(id);
    // Armazena também no localStorage para persistência
    localStorage.setItem('selectedProductId', id.toString());
  }

  getSelectedProduct() {
      const storedId = localStorage.getItem('selectedProductId');
    // Verifica se há um ID no localStorage (útil se a página for recarregada)
    if (storedId && !this.selectedProductId.value) {
      this.selectedProductId.next(Number(storedId));
    }
    return this.selectedProductId.asObservable();
  }

  clearSelectedProduct() {
    this.selectedProductId.next(null);
    localStorage.removeItem('selectedProductId');
  }

  startSaleOfSelectedProduct2(userName: string, idProduto: number) {
    const starSale = [userName,idProduto];
    this.startSellingSelectedProduct.next(starSale);
    // Armazena também no localStorage para persistência
    localStorage.setItem('startSaleOfSelectedProduct', starSale.toString());
  }

  getSaleOfSelectedProduct2() {
    // Verifica se há um ID no localStorage (útil se a página for recarregada)
    const storedId = localStorage.getItem('startSaleOfSelectedProduct');
    if (storedId && !this.startSellingSelectedProduct.value) {
      this.startSellingSelectedProduct.next(Number(storedId));
    }
    return this.startSellingSelectedProduct.asObservable();
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
