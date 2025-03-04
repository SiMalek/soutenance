import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // ✅ Fix: Corrected syntax for filtering by subThemeId
  getCategoriesBySubThemeId(subThemeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?subThemeId=${subThemeId}`);
  }
}
