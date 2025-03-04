import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private baseUrl = 'http://localhost:3000/themes';

  constructor(private http: HttpClient) { }

  getThemes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}