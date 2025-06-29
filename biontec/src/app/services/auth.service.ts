import { Injectable, EventEmitter } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {map, tap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {tsCastToAny} from "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util";
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
    // return this.http.post<IToken>(this.baseUrl+'login/',parseJson('?username='+credentials.username+'&password='+credentials.password));// JSON.stringify(credentials).valueOf());
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
    // return this._http.post(this.baseUrl + 'logout', { }, httpOptions);
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
    /*   https://www.bezkoder.com/angular-13-jwt-auth/
              https://www.youtube.com/watch?v=QdXHkybzrUU
              */
       //    https://gist.github.com/kaiofelixdeoliveira/e9a9cfca9de2a95ca27d4562926b059c
    //   https://balta.io/blog/login-logout-protecao-de-rotas-envio-de-tokens-com-angular
  /*
    console.log('Post com Body no auth.service---> ',`${this.baseUrl}login`,{ username, password });
    console.log('Post cru no auth.service---> ',this.baseUrl+'login/?username='+username+'&password='+password+'','',this.setUpHeaders());
    */
    return  this._http.post<IToken>(this.baseUrl+'login/?username='+username+'&password='+password+'','',this.setUpHeaders())
   .pipe(tap(respToken => {
      if(!respToken) return;
     // localStorage.setItem('access_token', btoa(JSON.stringify(respToken)));
    //  localStorage.setItem('currentUser', btoa(JSON.stringify(respToken)));

      // store user details and jwt token in local storage to keep user logged in between page refreshes
     // localStorage.setItem('currentUser', JSON.stringify(currentUser));
   //   console.log(' currentUser no auth.service---> ',respToken );
     // this.currentUserSubject.next(respToken);
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



/*
    createBasicAuthToken(login: UsuarioModel_T) {
      return 'Basic ' + window.btoa(login.username + ':' + login.password);
    }

  register(username: string, email: string, password: string): Observable<any> {
    return this._http.post(this.baseUrl + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  userAuthentication0(username:string, password:string) {
    var data:string ="username="+username+"&password="+password;// + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });

    console.log('Entrando no auth.service--->',this.baseUrl+'login/?username='+username+'&password='+password+'','',this.setUpHeaders());
    return this._http.post(this.baseUrl+'login/?username='+username+'&password='+password+'','',this.setUpHeaders());
  }

   fazerLogin(login: UsuarioModel_T){
    this._http.post<UsuarioModel_T>(this.baseUrl+'logar', login.username + login.password)
      .pipe( map(user =>{

      .subscribe((res:boolean) =>   this.usuarioAutenticado =  res  );
      .subscribe( res=>{  const user = res.find((a:any)=>{
          return a.username === login.username && a.password === login.password
          });
          https://youtu.be/eMJ5spB3P1c?t=2011

  if (user){
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    //   localStorage.setItem('currentUser',JSON.stringify(user));
    alert("Logado com sucesso");
    this.usuarioAutenticado = true;
    this.mostrarMenuEmitter.emit(true);
    // this.router.navigate(['/user-demo/ ' + '' + user.username + '']) ;
    this.router.navigate(['/'+ '' + user.username + '']);
  } else {
  this.usuarioAutenticado = false;
  this.mostrarMenuEmitter.emit(false);
  alert("Usuario ou senha inválido");
} // return user;
}));
}

*/

}
