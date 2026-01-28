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

  /*
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    let authRequest = request;

    // 1. Garante que se o token existir, ele SEMPRE será injetado
    if (token) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro capturado no Interceptor:', error);

        // 2. Se for 401 ou 403, o token provavelmente é inválido ou expirou
        if (error.status === 401 || error.status === 403) {
          this.tokenService.clearTokenExpired();
          this.apiErrorService.sendError("Sessão expirada. Por favor, faça login novamente.");
          return throwError(() => new Error('Sessão Expirada'));
        }

        // 3. Se for erro de servidor (como o "id must not be null"), repassa a mensagem real
        const errorMessage = error.error?.message || error.error?.error_message || 'Erro interno no servidor';
        this.apiErrorService.sendError(errorMessage);

        return throwError(() => error);
      })
    );
  }
}*/

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.tokenService.getToken();
    const requestUrl: Array<any> = request.url.split('/');
    const apiUrl: Array<any> = environment.API_PATH.split('/');

    if(token !== null){
      let clone = request.clone({
        headers: request.headers.set('Authorization', 'Bearer '+token)
      });

      return next.handle(clone).pipe(
        catchError(error => {
          console.log('No catchError do Interceptor',error)
          if(error.status === 401){
            this.tokenService.clearTokenExpired();
          }
          this.apiErrorService.sendError(error.error.message)
          return throwError('Session Expired');
        }) )  }
    return next.handle(request);
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
