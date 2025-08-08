import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Backend API'nizin temel URL'sini buraya yazın.
const API_URL = 'http://localhost:5000/api/Tasinmaz';

// Backend'den gelen verilere uyan arayüz
export interface TasinmazListDto {
  id?: number;
  ada: string;
  parsel: string;
  adres: string;
  koordinat: string;
  tasinmazTipi?: string;
  mahalleId: number;
}

// Yeni taşınmaz eklemek için kullanılan arayüz
export interface TasinmazAddRequest {
  ilId: number;
  ilceId: number;
  mahalleId: number;
  ada: string;
  parsel: string;
  adres: string;
  koordinat: string;
  tasinmazTipi: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  constructor(private http: HttpClient) { }

  /**
   * Backend'den gelen TasinmazListDto listesini çeker.
   */
  getTasinmazlar(): Observable<TasinmazListDto[]> {
    return this.http.get<TasinmazListDto[]>(API_URL);
  }

  /**
   * Kullanıcı ID'sine göre TasinmazListDto listesini çeker.
   */
  getKullaniciTasinmazlarim(userId: number): Observable<TasinmazListDto[]> {
    return this.http.get<TasinmazListDto[]>(`${API_URL}/GetByUserId/${userId}`);
  }

  /**
   * Yeni bir taşınmaz ekler.
   */
  addTasinmaz(tasinmaz: TasinmazAddRequest): Observable<TasinmazAddRequest> {
    return this.http.post<TasinmazAddRequest>(API_URL, tasinmaz);
  }

  /**
   * Belirtilen ID'deki taşınmazı siler.
   */
  deleteTasinmaz(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
