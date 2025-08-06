// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators'; // 'map' operatörünü kullanmak için

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // 1. Adım: Kullanıcı giriş yapmış mı kontrol et
    // isAuthenticated() yerine isLoggedIn() kullanıldı
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Giriş yapmamışsa login sayfasına yönlendir
      return false;
    }

    // 2. Adım: Kullanıcı giriş yapmışsa rolünü kontrol et
    return this.authService.userRole$.pipe(
      map(role => {
        if (role === 'Admin') {
          // Admin kullanıcılar sadece admin panel rotalarına erişebilir
          if (state.url.startsWith('/admin')) {
            return true; // Admin paneli ve alt sayfalarına erişime izin ver
          } else {
            // Admin'ler taşınmaz sayfalarına erişemez, varsayılan olarak admin-dashboard'a yönlendir
            this.router.navigate(['/admin-dashboard']);
            return false;
          }
        } else if (role === 'User') {
          // User rolü sadece taşınmaz sayfalarına erişebilir
          if (state.url.startsWith('/admin')) {
            // Admin sayfalarına erişimi engelle
            this.router.navigate(['/tasinmazlar']);
            return false;
          } else if (state.url === '/tasinmazlar' || state.url.startsWith('/tasinmaz-')) {
            return true; // Taşınmaz sayfalarına erişime izin ver
          } else {
            // Varsayılan olarak taşınmazlar listesine yönlendir
            this.router.navigate(['/tasinmazlar']);
            return false;
          }
        } else {
          // Rol belirlenememiş veya geçersizse login sayfasına yönlendir
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
