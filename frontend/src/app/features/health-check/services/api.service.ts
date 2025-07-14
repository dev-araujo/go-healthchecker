import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/health-check.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/check';

  constructor(private http: HttpClient) { }

  checkUrls(urls: string[]): Observable<ApiResponse> {
    const payload = { urls };
    return this.http.post<ApiResponse>(this.apiUrl, payload);
  }
}