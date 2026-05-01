import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TokenService} from '../token.service';
import {NotificationMgsService} from '../notification-mgs.service';
import {AuthService} from '../auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);
  private notification = inject(NotificationMgsService);
  private tokenService = inject(TokenService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
    let authReq = request;

    if (token) {
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro inesperado';

        switch (error.status) {
          case 401:
            errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
            this.authService.logout();
            break;

          case 403:
            errorMessage = 'Você não tem permissão para acessar este recurso.';
            break;

          default:
            errorMessage = error.error?.message || error.message || errorMessage;
            break;
        }

        this.notification.sendError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
};
