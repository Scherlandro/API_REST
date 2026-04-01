import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PurchaseStateService {

  private selectedProductsIds = new BehaviorSubject<number[]>([]);
  private saleData = new BehaviorSubject<any>(null);

  constructor() {
    this.loadFromStorage();
  }

  // -------------------------
  // 🔹 CARRINHO
  // -------------------------

  private loadFromStorage() {
    const stored = localStorage.getItem('selectedProductsIds');
    if (stored) {
      this.selectedProductsIds.next(JSON.parse(stored));
    }
  }

  private updateStorage(ids: number[]) {
    localStorage.setItem('selectedProductsIds', JSON.stringify(ids));
  }

  getSelectedProducts(): Observable<number[]> {
    return this.selectedProductsIds.asObservable();
  }

  getSelectedProductsValue(): number[] {
    return this.selectedProductsIds.value;
  }

  // No PurchaseStateService
  addSelectedProduct(id: number) {
    const current = this.selectedProductsIds.value;
    if (!current.includes(id)) {
      const updated = [...current, id];
      this.selectedProductsIds.next(updated);
      this.updateStorage(updated);
      // Opcional: atualiza "saleData" automaticamente
      this.refreshSaleData();
    }
  }

  private refreshSaleData() {
    const currentSale = this.saleData.value;
    if (currentSale) {
      currentSale.productIds = this.selectedProductsIds.value;
      this.saleData.next(currentSale);
      localStorage.setItem('saleData', JSON.stringify(currentSale));
    }
  }

  removeSelectedProduct(id: number) {
    const updated = this.selectedProductsIds.value.filter(p => p !== id);
    this.selectedProductsIds.next(updated);
    this.updateStorage(updated);
  }

  isProductInCart(id: number): boolean {
    return this.selectedProductsIds.value.includes(id);
  }

  getCartCount(): number {
    return this.selectedProductsIds.value.length;
  }

  // -------------------------
  // 🔹 VENDA
  // -------------------------

  startSale(userName: string) {
    const sale = {
      userName,
      productIds: this.selectedProductsIds.value
    };

    this.saleData.next(sale);
    localStorage.setItem('saleData', JSON.stringify(sale));
  }

  getSale(): Observable<any> {
    const stored = localStorage.getItem('saleData');
    if (stored && !this.saleData.value) {
      this.saleData.next(JSON.parse(stored));
    }
    return this.saleData.asObservable();
  }

  clearSale() {
    this.saleData.next(null);
    localStorage.removeItem('saleData');
  }

  clearCart() {
    this.selectedProductsIds.next([]);
    localStorage.removeItem('selectedProductsIds');
  }

}
