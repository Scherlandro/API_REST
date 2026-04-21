import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of, Subject, Subscription, switchMap, take} from "rxjs";
import {VendasService} from "./vendas.service";
import {CartItensService} from "./cart-items.service";
import {IUser} from "../interfaces/user";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {map, tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class PurchaseStateService {
  private selectedProductsIds = new BehaviorSubject<number[]>([]);
  private saleData = new BehaviorSubject<any>(null);
  private totalItemsCount = new BehaviorSubject<number>(0);
  totalItemsCount$ = this.totalItemsCount.asObservable();
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cartItensService: CartItensService,
    private userService: UserService,
  ) {
    this.loadFromStorage();
    this.initCartCountListener(); // Inicializa o listener
  }

  // -------------------------
  // CARRINHO
  // -------------------------

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

    // Use apenas UMA fonte de verdade
    // Se o usuário está logado, confie no estado local (que já foi sincronizado)
    const localCart = this.selectedProductsIds.value;
    this.totalItemsCount.next(localCart.length);

    // Opcional: Atualiza o banco em background sem afetar a contagem
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


  // Listener para atualizar contagem sempre que o carrinho mudar
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
/*
  addSelectedProduct(id: number) {
    const current = this.selectedProductsIds.value;
    if (!current.includes(id)) {
      const updated = [...current, id];
      this.selectedProductsIds.next(updated);
      this.updateStorage(updated);
      this.refreshSaleData();
    }
  }*/

  addSelectedProduct(id: number) {
    const current = this.selectedProductsIds.value;
    if (!current.includes(id)) {
      const updated = [...current, id];
      this.selectedProductsIds.next(updated);
      this.updateStorage(updated);
      this.refreshSaleData();
      // Não salva no banco aqui - isso deve ser feito separadamente
    }
  }

  addToDatabaseAndSync(userId: number, productId: number): Observable<any> {
    const cartItem = { userId, productId, quantity: 1 };

    return this.cartItensService.addCartItens(cartItem).pipe(
      tap(() => {
        // Após salvar no banco, atualiza o estado local
        const current = this.selectedProductsIds.value;
        if (!current.includes(productId)) {
          const updated = [...current, productId];
          this.selectedProductsIds.next(updated);
          this.updateStorage(updated);
        }
      })
    );
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
/*

  private updateCartCount(): void {
    const currentUser = this.authService.getUserName();

    if (!currentUser) {
      // Usuário não logado, usa apenas localStorage
      const localCart = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');
      this.totalItemsCount.next(localCart.length);
      return;
    }

    const localCart = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');
    const localCount = localCart.length;

    this.userService.getUserByUserName(currentUser).pipe(
      switchMap((user: IUser) => this.cartItensService.getCartofUser(user.id_usuario)),
      map((itensCart: any[]) => {
        const dbCount = itensCart ? itensCart.length : 0;
        return dbCount + localCount;
      }),
      take(1)
    ).subscribe({
      next: (total) => {
        this.totalItemsCount.next(total);
      },
      error: (err) => {
        console.error("Erro ao buscar contagem", err);
        this.totalItemsCount.next(localCount);
      }
    });
  }
*/

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
}


/*
@Injectable({
  providedIn: 'root'
})
export class PurchaseStateService {

  private selectedProductsIds = new BehaviorSubject<number[]>([]);
  private saleData = new BehaviorSubject<any>(null);
  private _currentCartCount: number = 0;
  private totalItemsCount = new BehaviorSubject<number>(0);
  totalItemsCount$ = this.totalItemsCount.asObservable();

  constructor(
    private authService: AuthService,
    private cartItensService: CartItensService,
    private userService: UserService,
  ) {
    this.loadFromStorage();
  }

  // -------------------------
  // CARRINHO
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

  updateCartCount(): number  {
    const currentUser = this.authService.getUserName();
    const localCart = JSON.parse(localStorage.getItem('selectedProductsIds') || '[]');

    this.userService.getUserByUserName(currentUser).pipe(
      switchMap((user: IUser) => this.cartItensService.getCartofUser(user.id_usuario)),
      map((itensCart: any[]) => {
        const dbCount = itensCart ? itensCart.length : 0;
        const localCount = localCart.length;
        this.updateStorage(localCount);
       // this.selectedProductsIds.next([]);
        localStorage.removeItem('selectedProductsIds');
        return dbCount + localCount;
      })
    ).subscribe({
      next: (total) => {
        this.totalItemsCount.next(total);
      },
      error: (err) => console.error("Erro ao buscar contagem", err)
    });
    console.log('QUANTIDADE DE ITENS', this._currentCartCount)
    return this._currentCartCount;
  }

  getCartCount(): number{
 // return this.updateCartCount();
  return this.selectedProductsIds.value.length;
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

  saveCartItenToDatabase(sale:any):Observable<any>{
   return  this.cartItensService.addCartItens(sale);
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

 /!* clearCart() {
    this.selectedProductsIds.next([]);
    localStorage.removeItem('selectedProductsIds');
  }*!/

}
*/
