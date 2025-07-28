// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode'; // jwt-decode'u bu şekilde import et

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/User';
  private tokenKey = 'jwt_token';
  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserIdFromToken();
  }

  private loadUserIdFromToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService (loadUserIdFromToken): localStorage\'dan token okunuyor. Token durumu:', token ? 'Mevcut' : 'Yok');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        console.log('AuthService (loadUserIdFromToken): Çözümlenen token:', decodedToken);
        // Token süresi dolmamışsa kullanıcıyı oturum açmış kabul et
        if (decodedToken.exp * 1000 > Date.now()) {
          this.userIdSubject.next(decodedToken.sub);
          console.log('AuthService (loadUserIdFromToken): Token geçerli. Kullanıcı ID:', decodedToken.sub);
        } else {
          // Token süresi dolmuşsa temizle
          console.log('AuthService (loadUserIdFromToken): Token süresi dolmuş, çıkış yapılıyor.');
          this.logout();
        }
      } catch (e) {
        console.error('AuthService (loadUserIdFromToken): Token çözümlenirken hata oluştu:', e);
        this.logout(); // Hatalı token'ı temizle
      }
    }
  }

  login(credentials: any): Observable<any> {
    console.log('AuthService (login): Giriş isteği gönderiliyor:', credentials);
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService (login): Backend yanıtı alındı:', response);
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          console.log('AuthService (login): Token localStorage\'a kaydedildi:', response.token);
          try {
            const decodedToken: any = jwt_decode(response.token);
            // userIdSubject.next'i setTimeout içinde çağırarak Angular'ın değişiklik algılama döngüsüne zaman tanıyoruz
            setTimeout(() => {
              this.userIdSubject.next(decodedToken.sub); // Token'dan userId'yi al ve güncelle
              console.log('AuthService (login): Token başarıyla çözümlendi (setTimeout sonrası). Kullanıcı ID:', decodedToken.sub);
            }, 0); // 0ms gecikme ile bir sonraki olay döngüsünde çalıştır
          } catch (e) {
            console.error('AuthService (login): Login sonrası token çözümlenirken hata oluştu:', e);
            this.logout();
          }
        } else {
          console.error('AuthService (login): Login yanıtında token bulunamadı veya geçersiz.');
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    console.log('AuthService (register): Kayıt isteği gönderiliyor:', userData);
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userIdSubject.next(null);
    console.log('AuthService (logout): Çıkış yapıldı, token temizlendi.');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService (getToken): Token çağrıldı. Token durumu:', token ? 'Mevcut' : 'Yok');
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const authenticated = !!token && !this.isTokenExpired(token);
    console.log('AuthService (isAuthenticated): Kimlik doğrulama durumu:', authenticated);
    return authenticated;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      const expired = decoded.exp < currentTime;
      console.log('AuthService (isTokenExpired): Token süresi kontrol edildi. Exp:', decoded.exp, 'Current:', currentTime, 'Expired:', expired);
      return expired;
    } catch (e) {
      console.error('AuthService (isTokenExpired): Hata oluştu, token geçersiz sayılıyor:', e);
      return true;
    }
  }

  getUserId(): number | null {
    const token = this.getToken();
    console.log('AuthService (getUserId): Kullanıcı ID alınıyor. Token durumu:', token ? 'Mevcut' : 'Yok');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          console.log('AuthService (getUserId): Kullanıcı ID:', decodedToken.sub);
          return decodedToken.sub;
        } else {
          console.log('AuthService (getUserId): Token süresi dolmuş.');
        }
      } catch (e) {
        console.error('AuthService (getUserId): Token çözümlenirken hata oluştu:', e);
      }
    }
    console.log('AuthService (getUserId): Token yok veya geçersiz, null döndürüldü.');
    return null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    console.log('AuthService (getUserRole): Kullanıcı Rolü alınıyor. Token durumu:', token ? 'Mevcut' : 'Yok');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          console.log('AuthService (getUserRole): Kullanıcı Rolü:', decodedToken.role);
          return decodedToken.role;
        } else {
          console.log('AuthService (getUserRole): Token süresi dolmuş.');
        }
      } catch (e) {
        console.error('AuthService (getUserRole): Token çözümlenirken hata oluştu:', e);
      }
    }
    console.log('AuthService (getUserRole): Token yok veya geçersiz, null döndürüldü.');
    return null;
  }

  // Debug amaçlı eklenen metod
  decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (e) {
      console.error('AuthService (decodeToken): Token çözümlenirken hata:', e);
      return null;
    }
  }
}
