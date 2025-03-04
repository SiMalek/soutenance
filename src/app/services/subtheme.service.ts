import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubthemeService {
  private baseUrl = 'http://localhost:3000/subThemes';

  constructor(private http: HttpClient) {}

  getSubthemes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // ✅ Fix: Corrected syntax for filtering by themeId
  getSubThemesByThemeId(themeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?themeId=${themeId}`);
  }
}
