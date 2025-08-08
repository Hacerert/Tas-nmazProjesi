import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Il {
  id: number;
  name: string;
}

export interface Ilce {
  id: number;
  name: string;
  ilId: number;
}

export interface Mahalle {
  id: number;
  name: string;
  ilceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:5000/api/Location'; // Backend location endpoint'iniz

  constructor(private http: HttpClient) { }

  getIller(): Observable<Il[]> {
    return this.http.get<Il[]>(`${this.apiUrl}/iller`);
  }

  getIlceler(ilId: number): Observable<Ilce[]> {
    return this.http.get<Ilce[]>(`${this.apiUrl}/ilceler/${ilId}`);
  }

  getMahalleler(ilceId: number): Observable<Mahalle[]> {
    return this.http.get<Mahalle[]>(`${this.apiUrl}/mahalleler/${ilceId}`);
  }
}