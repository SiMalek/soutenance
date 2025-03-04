import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-dashboard/admin-navbar/admin-navbar.component';

@Component({
    selector: 'app-flagged-questions',
    templateUrl: './flagged-questions.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, AdminNavbarComponent],
    styleUrls: ['./flagged-questions.component.css']
})
export class FlaggedQuestionsComponent implements OnInit {
    flaggedQuestions: any[] = [];
    users: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchFlaggedQuestions();
        this.fetchUsers();
    }

    fetchFlaggedQuestions(): void {
        this.http.get<any[]>('http://localhost:3000/flaggedQuestions').subscribe((data) => {
            this.flaggedQuestions = data;
        });
    }

    fetchUsers(): void {
        this.http.get<any[]>('http://localhost:3000/users').subscribe((data) => {
            this.users = data;
        });
    }

    getUserName(userId: string): string {
        const user = this.users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    }

    deleteFlaggedQuestion(id: number): void {
        this.http.delete(`http://localhost:3000/flaggedQuestions/${id}`).subscribe(() => {
            this.fetchFlaggedQuestions();
        });
    }

    addToQuestions(question: any): void {
        this.http.post('http://localhost:3000/questions', question).subscribe(() => {
            this.deleteFlaggedQuestion(question.id);
        });
    }
}
