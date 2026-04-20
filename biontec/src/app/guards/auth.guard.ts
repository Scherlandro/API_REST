
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/auth']);
};

/*

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
