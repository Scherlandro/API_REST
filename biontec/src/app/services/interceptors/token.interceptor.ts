import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse, HttpSentEvent,  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import {catchError} from "rxjs/operators";
import {TokenService} from "../token.service";
import {NotificationMgsService} from "../notification-mgs.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private apiErrorService: NotificationMgsService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log(request)
    const token = this.tokenService.getToken();
    const requestUrl: Array<any> = request.url.split('/');
    const apiUrl: Array<any> = environment.API_PATH.split('/');

    // if (token && requestUrl[2] === apiUrl[2]) {
    // token para inserir no headers
    if(token !== null){
      let clone = request.clone({
     // setHeaders: {Authorization:`Bearer ${token}`,token: `${token}`}
        headers: request.headers.set('Authorization', 'Bearer '+token)
      });
 //  https://balta.io/blog/login-logout-protecao-de-rotas-envio-de-tokens-com-angular
//  https://stackoverflow.com/questions/61081250/angular-9-dependency-injection-error-the-class-cannot-be-created-via-dependen
     //  console.log('Headers do Interceptor-->',clone)
      return next.handle(clone).pipe(
        catchError(error => {
          console.log('No catchError do Interceptor',error)
   //  if (error instanceof HttpErrorResponse && error.status === 401){
          if(error.status === 401){
            this.tokenService.clearTokenExpired();
            // this.authService.logout();
          }
          this.apiErrorService.sendError(error.error.message)
          return throwError('Session Expired');
          //  return throwError(error.message);
        }) )  }
    return next.handle(request);
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
