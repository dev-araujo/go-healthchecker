import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/health-check.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = `${environment.apiUrl}/check`;

  constructor(private http: HttpClient) { }

  checkUrls(urls: string[]): Observable<ApiResponse> {
    const payload = { urls };
    return this.http.post<ApiResponse>(this.apiUrl, payload);
  }
}