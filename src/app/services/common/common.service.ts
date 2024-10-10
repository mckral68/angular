import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService<T> {
  constructor(
    private http: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}

  // Tüm öğeleri alma
  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
  }

  // Belirli bir öğeyi alma
  getById(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  // Yeni öğe ekleme
  add(endpoint: string, item: T): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/${endpoint}`, item);
  }

  // Öğeyi güncelleme
  update(endpoint: string, item: T): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/${endpoint}`, item);
  }

  // Öğeyi silme
  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
export class ResponseDTO {
  data: object[];
  error: object;
  isSuccessful: boolean;
  message: string;
  statusCode: number;
}
