import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as stringSimilarity from 'string-similarity';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addQuestion(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateQuestion(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  exportToExcel(data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'questions.xlsx');
  }

  importFromExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/import/excel`, formData);
  }

  uploadExcel(data: any[]): Observable<any> {
    const requests = data.map(item => {
      const newItem = { ...item, id: this.generateRandomId() };
      return this.http.post<any>(this.apiUrl, newItem);
    });
    return forkJoin(requests);
  }

  private generateRandomId(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  getThemes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/themes');
  }

  getSubThemes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/subThemes');
  }

  findDuplicates(questions: any[]): any[] {
    const duplicates = [];
  
    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const question1 = questions[i].question.toLowerCase();
        const question2 = questions[j].question.toLowerCase();
  
        // Tokenize questions into words
        const words1 = question1.split(/\s+/).filter(Boolean);
        const words2 = question2.split(/\s+/).filter(Boolean);
  
        // Create word frequency maps
        const wordFrequency1 = this.getWordFrequency(words1);
        const wordFrequency2 = this.getWordFrequency(words2);
  
        // Calculate similarity based on common words and their frequency
        const similarity = this.calculateWordSimilarity(wordFrequency1, wordFrequency2);
  
        if (similarity >= 0.4) { // Use the 40% threshold
          duplicates.push({
            question1: questions[i],
            question2: questions[j],
            similarity
          });
        }
      }
    }
  
    return duplicates;
  }
  
  // Helper function to create a word frequency map
  private getWordFrequency(words: string[]): Map<string, number> {
    const frequencyMap = new Map<string, number>();
    for (const word of words) {
      frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
    }
    return frequencyMap;
  }
  
  // Helper function to calculate similarity based on word frequency
  private calculateWordSimilarity(
    frequencyMap1: Map<string, number>,
    frequencyMap2: Map<string, number>
  ): number {
    const allWords = new Set([...frequencyMap1.keys(), ...frequencyMap2.keys()]);
    let commonScore = 0;
    let totalScore = 0;
  
    for (const word of allWords) {
      const count1 = frequencyMap1.get(word) || 0;
      const count2 = frequencyMap2.get(word) || 0;
  
      // Add to common score if the word exists in both questions
      if (count1 > 0 && count2 > 0) {
        commonScore += Math.min(count1, count2);
      }
  
      // Add to total score
      totalScore += Math.max(count1, count2);
    }
  
    // Avoid division by zero
    if (totalScore === 0) return 0;
  
    // Return the similarity ratio
    return commonScore / totalScore;
  }

  mergeQuestions(id1: number, id2: number): Observable<any> { 
    return forkJoin([
      this.http.get<any>(`${this.apiUrl}/${id1}`),
      this.http.get<any>(`${this.apiUrl}/${id2}`)
    ]).pipe(
      switchMap(([question1, question2]) => {
        if (!question1 || !question2) {
          return throwError(() => new Error('Questions not found'));
        }
  
        const mergedQuestion = {
          ...question1,
          question: `${question1.question} / ${question2.question}`,
          answer: `${question1.answer} / ${question2.answer}`,
          tags: Array.from(new Set([
            ...(Array.isArray(question1.tags) ? question1.tags : []),
            ...(Array.isArray(question2.tags) ? question2.tags : [])
          ]))
        };
        
        return this.updateQuestion(id1, mergedQuestion).pipe(
          switchMap(() => this.deleteQuestion(id2)) // Delete only if update succeeds
        );
      }),
      catchError(error => {
        console.error('Merge failed:', error);
        return throwError(() => new Error('Failed to merge questions'));
      })
    );
  }
  
}