import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaggedQuestionService {
  private apiUrl = 'http://localhost:3000/flaggedQuestions';

  constructor(private http: HttpClient) { }

  addFlaggedQuestion(question: string): Observable<any> {
    const flaggedQuestion = { question };
    return this.http.post(this.apiUrl, flaggedQuestion);
  }
}