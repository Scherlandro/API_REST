import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription, switchMap, take} from "rxjs";
import {CartItensService} from "./cart-items.service";
import {IUser} from "../interfaces/user";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import { tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class PurchaseStateService {
  private selectedProductsIds = new BehaviorSubject<number[]>([]);
  private showBannerSubject = new BehaviorSubject<boolean>(false);
  private saleData = new BehaviorSubject<any>(null);
  private totalItemsCount = new BehaviorSubject<number>(0);
  totalItemsCount$ = this.totalItemsCount.asObservable();
  private subscription: Subscription | null = null;
  public showBanner$ = this.showBannerSubject.asObservable();

  constructor(
    private authService: AuthService,
    private cartItensService: CartItensService,
    private userService: UserService,
  ) {
    this.loadFromStorage();
    this.initCartCountListener();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('selectedProductsIds');
    if (stored) {
      this.selectedProductsIds.next(JSON.parse(stored));
    }
  }

  syncCartFromDatabase(productIds: number[]) {
    // Atualiza o BehaviorSubject sem duplicar
    this.selectedProductsIds.next(productIds);
    this.updateStorage(productIds);
    this.refreshSaleData();
    // A contagem será atualizada automaticamente pelo listener
  }


  private updateStorage(ids: number[]) {
    localStorage.setItem('selectedProductsIds', JSON.stringify(ids));
  }

  private updateCartCount(): void {
    const currentUser = this.authService.getUserName();

    if (!currentUser) {
      const localCart = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');
      this.totalItemsCount.next(localCart.length);
      return;
    }
    const localCart = this.selectedProductsIds.value;
    this.totalItemsCount.next(localCart.length);

    this.userService.getUserByUserName(currentUser).pipe(
      switchMap((user: IUser) => this.cartItensService.getCartofUser(user.id_usuario)),
      take(1)
    ).subscribe({
      next: (itensCart: any[]) => {
        // Verifica se há diferenças e sincroniza se necessário
        const dbIds = itensCart.map(item => item.productId);
        const localIds = this.selectedProductsIds.value;

        if (JSON.stringify(dbIds.sort()) !== JSON.stringify(localIds.sort())) {
          // Sincroniza o estado local com o banco (se necessário)
          this.selectedProductsIds.next(dbIds);
          this.updateStorage(dbIds);
        }
      },
      error: (err) => console.error("Erro ao sincronizar com banco", err)
    });
  }

  private initCartCountListener() {
    // Evita múltiplas assinaturas
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.selectedProductsIds.subscribe(() => {
      this.updateCartCount();
    });
  }

  getSelectedProducts(): Observable<number[]> {
    return this.selectedProductsIds.asObservable();
  }

  getSelectedProductsValue(): number[] {
    return this.selectedProductsIds.value;
  }

  addSelectedProduct(id: number) {
    const current = this.selectedProductsIds.value;
    if (!current.includes(id)) {
      const updated = [...current, id];
      this.selectedProductsIds.next(updated);
      this.updateStorage(updated);
      this.refreshSaleData();
    }
  }
/*
  // Adicione ou verifique se existe no PurchaseStateService
  getStoredProductId(): number | null {
    const stored = localStorage.getItem('selectedProductsIds');
    if (stored) {
      const ids = JSON.parse(stored);
      return ids.length > 0 ? ids[ids.length - 1] : null;
    }
    return null;
  }
// Método para limpar o storage temporário após a persistência
  clearStorageIds() {
    localStorage.removeItem('selectedProductsIds');
    this.selectedProductsIds.next([]);
  }
*/

  addToDatabaseAndSync(userId: number, productId: number): Observable<any> {
    const cartItem = { userId, productId, quantity: 1 };
    return this.cartItensService.addCartItens(cartItem).pipe(
      tap(() => {
        const current = this.selectedProductsIds.value;
        if (!current.includes(productId)) {
          const updated = [...current, productId];
          this.selectedProductsIds.next(updated);
          this.updateStorage(updated);
        } }) );
  }

  private refreshSaleData() {
    const currentSale = this.saleData.value || JSON.parse(localStorage.getItem('saleData') || '{}');

    if (currentSale && currentSale.productIds) {
      currentSale.productIds = this.selectedProductsIds.value;
      this.saleData.next(currentSale);
      localStorage.setItem('saleData', JSON.stringify(currentSale));
    }
  }

  removeSelectedProduct(id: number) {
    const updated = this.selectedProductsIds.value.filter(p => p !== id);
    this.selectedProductsIds.next(updated);
    this.updateStorage(updated);
    this.refreshSaleData();
  }

  isProductInCart(id: number): boolean {
    return this.selectedProductsIds.value.includes(id);
  }

  getCartCount(): Observable<number> {
    return this.totalItemsCount$;
  }

  getCurrentCartCount(): number {
    return this.totalItemsCount.value;
  }

  startShoppingCart(userName: string) {
    const sale = {
      userName,
      productIds: this.selectedProductsIds.value
    };
    this.saleData.next(sale);
    localStorage.setItem('saleData', JSON.stringify(sale));
    this.saveCartItenToDatabase(sale);
  }

  saveCartItenToDatabase(sale: any): Observable<any> {
    return this.cartItensService.addCartItens(sale);
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

  // Limpeza para evitar memory leaks
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showBanner(show: boolean) {
    this.showBannerSubject.next(show);
    localStorage.setItem('show_banner', JSON.stringify(show));
  }

  getBanner(): boolean {
    const stored = localStorage.getItem('show_banner');
    return stored ? JSON.parse(stored) : false;
  }
}




