// @ts-ignore

import {Observable} from "rxjs/index";
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
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
    //return this.router.navigate(['auth'])
  }
}
