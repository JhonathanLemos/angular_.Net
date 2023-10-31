import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services-security/auth.service';
import { TokenService } from '../services-security/token.service';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Object> {

    if (state.url === '/login' || state.url === '/register') {
      this.router.navigate(['/clientes']);
      return of(true);
    }
    return this.tokenService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Token válido');
          return of(true); // Permite o acesso à rota
        } else {
          console.log('Token inválido ou expirado');
          this.authService.logout();
          this.router.navigate(['/login']);
          return of(false); // Impede o acesso à rota
        }
      }),
      catchError((error) => {
        console.error('Ocorreu um erro:', error);
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(false); // Impede o acesso à rota em caso de erro
      })
    );
  }
}
