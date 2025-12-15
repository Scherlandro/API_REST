import { Injectable, EventEmitter } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {map, tap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {BaseService} from "./base.service";
import {IUser} from "../interfaces/user";
import {IToken} from "../interfaces/token";
import {ICredential} from "../interfaces/credential";
import {TokenService} from "./token.service";

const httpOptions = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
  })
  export class AuthService extends BaseService{

  private baseUrl: string = environment.API_PATH+'api/';

    private currentUserSubject: BehaviorSubject<IUser>;
    public currentUser: Observable<IUser>;
    public usuarioAutenticado: boolean = false;
    mostrarMenuEmitter = new EventEmitter<boolean>();

    constructor(private _http: HttpClient,
            private router: Router,
            private tokenService: TokenService
                )
   {
     super('auth')
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: ICredential): Observable<IToken>{
   this.setUserName(credentials.username);
    return this._http.post<IToken>(this.baseUrl+'login/?username='+credentials.username+'&password='+credentials.password+'','')
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/'])
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.usuarioAutenticado = false;
    this.mostrarMenuEmitter.emit(false);
  }

   currentUserValue() {
    console.log('USUARIO LOGADO -->', this.currentUser, this.currentUserSubject.getValue())
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
