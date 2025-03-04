import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlaggedQuestionService } from '../../services/flagged-question.service';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  flaggedQuestion: string = '';
  confirmationMessage: string = '';

  constructor(
    private flaggedQuestionService: FlaggedQuestionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  flagQuestion() {
    if (this.flaggedQuestion.trim()) {
      this.flaggedQuestionService.addFlaggedQuestion(this.flaggedQuestion).subscribe(() => {
        this.confirmationMessage = 'Your question has been sent to the admin.';
        this.flaggedQuestion = ''; 
      });
    } else {
      this.confirmationMessage = 'Please enter a question before sending.';
    }
  }
}