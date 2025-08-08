// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Token almak için AuthService'i kullanacağız

// Backend'den gelecek kullanıcı verisinin yapısı
interface User {
  id: number;
  username: string;
  role: string;
  // Diğer alanlar buraya eklenebilir (örneğin email, vs.)
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Backend'inizin gerçek adresi ve portu: http://localhost:5000
  private apiUrl = 'http://localhost:5000/api/User'; // Backend'in User Controller'ının API yolu

  constructor(private http: HttpClient, private authService: AuthService) { }

  // HTTP istekleri için yetkilendirme başlığını (Authorization Header) oluşturan yardımcı metod
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    // Token null veya undefined ise boş string olarak ayarla
    const safeToken = token ?? ''; 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${safeToken}` // JWT token'ı Authorization başlığına ekle
    });
  }

  // Tüm kullanıcıları getiren metod (Admin yetkisi gerektirir)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/GetAllUsers`, { headers: this.getHeaders() });
  }

  // Kullanıcı silme metod (Admin yetkisi gerektirir)
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteUser/${userId}`, { headers: this.getHeaders() });
  }

  // Kullanıcı güncelleme metod (örnek, Admin yetkisi gerektirir)
  updateUser(userId: number, userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateUser/${userId}`, userData, { headers: this.getHeaders() });
  }

  // Tek bir kullanıcıyı ID'ye göre getiren metod (Admin yetkisi gerektirir)
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/GetUserById/${userId}`, { headers: this.getHeaders() });
  }
}
