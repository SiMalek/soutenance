import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  @Input() questions: any[] = [];

  ngOnInit() {
    console.log('Questions loaded:', this.questions);
  }

  flagQuestion(question: any) {
    // Implement flagging logic here
    console.log('Question flagged:', question);
  }
}