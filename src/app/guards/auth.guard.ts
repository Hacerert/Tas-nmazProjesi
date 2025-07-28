// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('AuthGuard: canActivate çağrıldı. Mevcut URL:', state.url);

    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: Kullanıcı kimlik doğrulamasından geçti.');
      return true;
    } else {
      console.log('AuthGuard: Kullanıcı kimlik doğrulaması yapmamış, login sayfasına yönlendiriliyor.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
