import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../services/question.service';

interface DuplicateQuestion {
  question1: {
    id: string;
    question: string;
    author: string;
    tags: string[];
  };
  question2: {
    id: string;
    question: string;
    author: string;
    tags: string[];
  };
  similarity: number;
}

@Component({
  selector: 'app-duplicate-detector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './duplicate-detector.component.html',
  styleUrls: ['./duplicate-detector.component.scss']
})
export class DuplicateDetectorComponent implements OnInit {
  duplicates: DuplicateQuestion[] = [];
  isLoading = false;
  similarityThreshold = 0.4; // Adjusted to 40%
  sortOrder: 'asc' | 'desc' = 'desc';
  selectedDuplicate: DuplicateQuestion | null = null;

  constructor(
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchDuplicates();
  }

  fetchDuplicates() {
    this.isLoading = true;
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        this.duplicates = this.questionService.findDuplicates(questions)
          .filter(d => d.similarity >= this.similarityThreshold)
          .sort((a, b) => this.sortOrder === 'desc' ?
            b.similarity - a.similarity :
            a.similarity - b.similarity
          );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading duplicates: ' + error.message, 'Close', {
          duration: 5000
        });
      }
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.duplicates = [...this.duplicates].sort((a, b) =>
      this.sortOrder === 'desc' ?
        b.similarity - a.similarity :
        a.similarity - b.similarity
    );
  }

  mergeDuplicates(duplicate: DuplicateQuestion) {
    if (confirm('Are you sure you want to merge these questions?')) {
      this.questionService.mergeQuestions(
        Number(duplicate.question1.id),
        Number(duplicate.question2.id)
      ).subscribe({
        next: () => {
          this.snackBar.open('Questions merged successfully!', 'Close', {
            duration: 3000
          });
          this.fetchDuplicates();
        },
        error: (error) => {
          this.snackBar.open('Error merging questions: ' + error.message, 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  selectDuplicate(duplicate: DuplicateQuestion) {
    this.selectedDuplicate = this.selectedDuplicate === duplicate ? null : duplicate;
  }

  getSimilarityColor(similarity: number): string {
    if (similarity >= 0.8) return '#ff4d4d'; // Red for high similarity
    if (similarity >= 0.6) return '#ffa64d'; // Orange for medium similarity
    if (similarity >= 0.4) return '#70db70'; // Green for low similarity
    return '#cccccc'; // Gray for similarity below the threshold
  }
}