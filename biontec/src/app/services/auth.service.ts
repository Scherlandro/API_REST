import {Injectable, EventEmitter, inject, signal, computed} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable,tap,BehaviorSubject } from 'rxjs';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {BaseService} from "./base.service";
import {IUser} from "../interfaces/user";
import {IToken} from "../interfaces/token";
import {ICredential} from "../interfaces/credential";
import {TokenService} from "./token.service";


@Injectable({ providedIn:'root' })
  export class AuthService extends BaseService{

  private readonly _http = inject(HttpClient);
  private readonly router = inject(Router);
  private tokenService= inject(TokenService);
  private readonly baseUrl = `${environment.API_PATH}api/`;

  private _currentUser = signal<IUser | null>(this.getUserFromStorage());
  public currentUser = this._currentUser.asReadonly();
  public usuarioAutenticado: boolean = false;
  mostrarMenuEmitter = new EventEmitter<boolean>();

  // Computed: Reage automaticamente sempre que _currentUser mudar
  public isAuthenticated = computed(() => !!this._currentUser());
//  private currentUserSubject;
 // private currentUserSubject= inject(BehaviorSubject<IUser>);

// private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenService.hasToken());
 // public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


      constructor( )     {   super('auth')
     // this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(<string>localStorage.getItem('currentUser')));
    //  this.currentUser = this.currentUserSubject.asObservable();
    }

  private getUserFromStorage(): IUser | null {
    const userJson = localStorage.getItem('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  login(credentials: ICredential): Observable<IToken> {
    return this._http.post<IToken>(`${this.baseUrl}login`, credentials).pipe(
      tap(res => {
        this.saveSession(res);
       // this.tokenService.saveToken(res.access_token);
       // this.isAuthenticatedSubject.next(true);
      })
    );
  }

/*  login(credentials: ICredential): Observable<IToken>{
   this.setUserName(credentials.username);
    return this._http.post<IToken>(this.baseUrl+'login/?username='+credentials.username+'&password='+credentials.password+'','')
  }*/

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    this._currentUser.set(null);
    this.router.navigate(['/'])
    // @ts-ignore
    //this.currentUserSubject.next(null);
    this.usuarioAutenticado = false;
    this.mostrarMenuEmitter.emit(false);
  }

  private saveSession(data: IToken) {

    localStorage.setItem('token', data.access_token);
    const payload = this.tokenService.getPayload();
    const user: IUser = {
      id_usuario: payload.id,
      name: payload.name,
      username: payload.username,
      password: ''
    };
  localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser.set(user);

    // Opcional: Redirecionar após login bem sucedido
    // this.router.navigate(['/dashboard']);
  }

   currentUserValue() {
  //  console.log('USUARIO LOGADO -->', this.currentUser, this.currentUserSubject.getValue())
   // return this.currentUserSubject.getValue();
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  setUserName(username:string){
    localStorage.setItem('username', JSON.stringify(username));
  }

  getUserName(){
    return JSON.parse(<string>localStorage.getItem('username'));
  }

  getUserClaims(){
    return  this._http.get(this.baseUrl+'user/token-refresh');
  }

  userAuthentication(username: string, password: string):Observable<IToken> {
    return  this._http.post<IToken>(this.baseUrl+'login/?username='+username+'&password='+password+'','',this.setUpHeaders())
   .pipe(tap(respToken => {
      if(!respToken) return;
       return respToken;
    }));
    }

   obterTokenDoLog() {
    return localStorage.getItem('token')
      ? JSON.parse(atob(<string>localStorage.getItem('token'))) : null;
  }

   obterIdUsuarioLogado() {
    return localStorage.getItem('token')
      ? <any>(JSON.parse(atob(<string>localStorage.getItem('token'))) as IUser).name
      : null;
  }

  logado(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  isLogged(): boolean{
    const token = localStorage.getItem('token')
    return !! token
  }


}
