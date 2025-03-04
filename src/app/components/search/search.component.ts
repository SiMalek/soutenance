import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{ NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  questions: any[] = [];
  filteredQuestions: any[] = [];
  searchQuery: string = '';

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.questions = data;
      this.filteredQuestions = data; 
    });
  }

  filterQuestions(): void {
    this.filteredQuestions = this.questions.filter((question) =>
      question.question.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
