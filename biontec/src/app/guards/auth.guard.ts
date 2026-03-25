
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos o Signal de autenticação que definimos na Service
  if (authService.isAuthenticated()) {
    return true;
  }

  // Se não estiver autenticado, manda para o login
  return router.createUrlTree(['/auth']);
};

/*

import {Observable} from "rxjs/index";
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {TokenService} from "../services/token.service";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private tokenService: TokenService,
              private router: Router
              ) { }

  canActivate(
    rota: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  if (this.tokenService.isLogged()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}*/
