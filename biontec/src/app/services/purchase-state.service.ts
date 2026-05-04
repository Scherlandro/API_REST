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
  //private showBannerSubject = new BehaviorSubject<boolean>(false);
  private showBannerSubject = new BehaviorSubject<boolean>(localStorage.getItem('show_banner') === 'true');
  private totalItemsCount = new BehaviorSubject<number>(0);

  public totalItemsCount$ = this.totalItemsCount.asObservable();
  public showBanner$ = this.showBannerSubject.asObservable();
  public selectedIdProduct$ = this.selectedProductsIds.value;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cartItensService: CartItensService,
    private userService: UserService,
  ) {
    const bannerSalvo = localStorage.getItem('show_banner') === 'true';
    this.showBannerSubject.next(bannerSalvo);
    this.loadFromStorage();
  //  this.initCartCountListener();
  }

  public updateCountFromDatabase(email: string): void {
    this.userService.getUserByUserName(email).pipe(
      switchMap((user: IUser) => this.cartItensService.getCartofUser(user.id_usuario)),
      take(1) // Garante que a inscrição feche após receber os dados
    ).subscribe({
      next: (cartItems: any[]) => {
        const dbIds = cartItems.map(item => item.productId);

        // 1. Atualiza o estado global (isso reflete no totalItemsCount$)
        this.updateState(dbIds);

        // 2. Limpa o storage local (pois agora o BD é o mestre)
        localStorage.removeItem('selectedProductsIds');

        console.log('Contador sincronizado com BD após login:', dbIds.length);
      },
      error: (err) => console.error("Erro ao sincronizar contador pós-login", err)
    });
  }

    private loadFromStorage() {
    const stored = localStorage.getItem('selectedProductsIds');
    if (stored) {
      const ids = JSON.parse(stored);
      this.updateState(ids);
    }
  }

  public updateState(ids: number[]) {
    this.selectedProductsIds.next(ids);
    this.totalItemsCount.next(ids.length);
  }

  // Sincroniza com o Banco e LIMPA o storage local para evitar lixo
  public syncCartFromDatabase(productIds: number[]) {
    this.updateState(productIds);
  //  localStorage.removeItem('selectedProductsIds');
  }

  public clearAllState(): void {
    this.updateState([]);
    this.showBannerSubject.next(false);
    localStorage.clear(); // Limpa tudo no logout
  }

  addSelectedProduct(id: number) {
    const current = this.selectedProductsIds.value;
    if (!current.includes(id)) {
      const updated = [...current, id];
      this.updateState(updated);
      localStorage.setItem('selectedProductsIds', JSON.stringify(updated));
      this.showBanner(true);
    }
  }

  removeSelectedProduct(id: number) {
    const updated = this.selectedProductsIds.value.filter(p => p !== id);
    this.updateState(updated);
    localStorage.setItem('selectedProductsIds', JSON.stringify(updated));
  }
  getCartCount(): Observable<number> {
    return this.totalItemsCount$;
  }

  showBanner(show: boolean) {
    // Só dispara se o valor for diferente do atual
    if (this.showBannerSubject.value !== show) {
      this.showBannerSubject.next(show);
      localStorage.setItem('show_banner', JSON.stringify(show));
    }
  }

  getBanner(): boolean {
    return localStorage.getItem('show_banner') === 'true';
  }

  getProdSelect(): Observable<number[]> {
    return this.selectedProductsIds.asObservable();
  }

  getSelectedIdsValue(): number[] {
    return this.selectedProductsIds.value;
  }

  // Getters simples
  getSelectedProducts(): Observable<number[]> { return this.selectedProductsIds.asObservable(); }
  getSelectedProductsValue(): number[] { return this.selectedProductsIds.value; }
  isProductInCart(id: number): boolean { return this.selectedProductsIds.value.includes(id); }
 // showBanner(show: boolean) { this.showBannerSubject.next(show); }
 // getBanner(): boolean { return JSON.parse(localStorage.getItem('show_banner') || 'false'); }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
