// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend'inizin gerçek adresi ve portu: http://localhost:5000
  private apiUrl = 'http://localhost:5000/api/User'; // <-- HTTPS yerine HTTP olarak DÜZELTTİK!
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public token$: Observable<string | null> = this.tokenSubject.asObservable();

  private userRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  private userIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userId$: Observable<string | null> = this.userIdSubject.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      this.tokenSubject.next(storedToken);
      this.decodeTokenAndSetClaims(storedToken);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('jwt_token', token);
          this.tokenSubject.next(token);
          this.decodeTokenAndSetClaims(token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.tokenSubject.next(null);
    this.userRoleSubject.next(null);
    this.userIdSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.tokenSubject.value;
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }

  private decodeTokenAndSetClaims(token: string): void {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;
      const userId = decodedToken.sub || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier']; 
      
      this.userRoleSubject.next(role || null);
      this.userIdSubject.next(userId || null);
    } catch (error) {
      console.error('JWT token çözümlenirken hata oluştu:', error);
      this.userRoleSubject.next(null);
      this.userIdSubject.next(null);
    }
  }
}
