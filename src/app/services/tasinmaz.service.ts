// src/app/services/tasinmaz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // AuthService'i import et

// Tasinmaz interface'ini burada tanımlıyoruz
export interface Tasinmaz {
  id?: number; // Backend'de otomatik oluştuğu için opsiyonel
  ada: string;
  parsel: string;
  adres: string;
  koordinat: string;
  tasinmazTipi: string;
  userId: number;
  // İl, İlçe ve Mahalle artık doğrudan string değil, iç içe objeler
  mahalle: { // Mahalle bir obje
    id: number;
    ad: string; // Mahalle adı burada
    ilce: { // İlçe bir obje
      id: number;
      ad: string; // İlçe adı burada
      il: { // İl bir obje
        id: number;
        ad: string; // İl adı burada
      };
    };
  };
}
@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = 'http://localhost:5000/api/Tasinmaz'; // Backend API URL'si

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
    // Token yoksa bile Content-Type ile dön
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Kullanıcının taşınmazlarını getiren metot - URL DÜZELTİLDİ
  getKullaniciTasinmazlarim(userId: number): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}/kullanici-tasinmazlarim/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Yeni taşınmaz ekleme metodu
  addTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    return this.http.post<Tasinmaz>(this.apiUrl, tasinmaz, { headers: this.getAuthHeaders() });
  }

  // Taşınmaz güncelleme metodu (SRS'de var)
  updateTasinmaz(id: number, tasinmaz: Tasinmaz): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tasinmaz, { headers: this.getAuthHeaders() });
  }

  // Taşınmaz silme metodu (SRS'de var)
  deleteTasinmaz(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Tek bir taşınmazı ID ile getirme metodu (SRS'de var)
  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
