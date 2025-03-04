import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { AddEditModalComponent } from '../add-edit-modal/add-edit-modal.component';
import { UploadModalComponent } from '../upload/upload.component';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface Question {
  id: string;
  question: string;
  answer: string;
  theme?: string;
  subTheme?: string;
  category?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FlaggedQuestion {
  id: string;
  question: string;
  user_id: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [
    AddEditModalComponent,
    UploadModalComponent,
    CommonModule,
    AdminNavbarComponent,
    RouterModule,
    ConfirmModalComponent,
    FormsModule
  ],
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [
    trigger('buttonHover', [
      state('initial', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('initial <=> hovered', animate('200ms ease-in-out'))
    ]),
    trigger('rowHover', [
      state('initial', style({ backgroundColor: 'white' })),
      state('hovered', style({ backgroundColor: '#f8f9fa' })),
      transition('initial <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  qaList: Question[] = [];
  filteredQAList: Question[] = [];
  flaggedQuestions: FlaggedQuestion[] = [];
  users: User[] = [];
  themes: any[] = [];
  subThemes: any[] = [];

  isAddEditModalOpen = false;
  isUploadModalOpen = false;
  isConfirmModalOpen = false;
  selectedQA: Question | null = null;
  qaToDelete: Question | null = null;
  unreadCount: number = 0;
  searchTerm: string = '';
  buttonStates = {
    add: 'initial',
    export: 'initial',
    upload: 'initial',
    flagged: 'initial'
  };
  rowStates: { [key: string]: string } = {};

  currentPage: number = 1;

  totalItems: number = 0;
  totalPages: number = 0;
  paginationStart: number = 0;
  paginationEnd: number = 0;


  totalQuestions: number = 0;
  answeredQuestions: number = 0;
  flaggedCount: number = 0;
  activeUsers: number = 0;

  constructor(
    private questionService: QuestionService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchQAList();
    this.fetchFlaggedQuestions();
    this.fetchUsers();
    this.fetchThemes();
    this.fetchSubThemes();
    this.calculateDashboardStats();
  }

  // Data Fetching
  fetchQAList(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.qaList = data;
      this.filteredQAList = data;
      this.totalItems = data.length;

      this.initializeRowStates();
      this.calculateDashboardStats();
    });
  }

  fetchFlaggedQuestions(): void {
    this.http.get<FlaggedQuestion[]>('http://localhost:3000/flaggedQuestions').subscribe((data) => {
      this.flaggedQuestions = data;
      this.flaggedCount = data.length;
    });
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:3000/users').subscribe((data) => {
      this.users = data;
      this.activeUsers = data.length;
    });
  }

  fetchThemes(): void {
    this.http.get<any[]>('http://localhost:3000/themes').subscribe((data) => {
      this.themes = data;
    });
  }

  fetchSubThemes(): void {
    this.http.get<any[]>('http://localhost:3000/subThemes').subscribe((data) => {
      this.subThemes = data;
    });
  }


  calculateDashboardStats(): void {
    this.answeredQuestions = this.qaList.filter(qa => qa.answer && qa.answer.trim() !== '').length;
    this.totalQuestions = this.qaList.length;
  }

  // Modal Operations
  openAddModal(): void {
    this.selectedQA = null;
    this.isAddEditModalOpen = true;
  }

  editQA(qa: Question): void {
    this.selectedQA = { ...qa };
    this.isAddEditModalOpen = true;
  }

  confirmDelete(qa: Question): void {
    this.qaToDelete = qa;
    this.isConfirmModalOpen = true;
  }

  handleConfirmDelete(): void {
    if (this.qaToDelete) {
      this.questionService.deleteQuestion(Number(this.qaToDelete.id)).subscribe(() => {
        this.fetchQAList();
        this.isConfirmModalOpen = false;
        this.qaToDelete = null;
      });
    }
  }

  // Export/Import Operations
  exportToExcel(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.questionService.exportToExcel(data);
    });
  }

  openUploadModal(): void {
    this.isUploadModalOpen = true;
  }


  onSearch(): void {
    const filtered = this.qaList.filter(qa => {
      const question = qa.question ? qa.question.toLowerCase() : '';
      const answer = qa.answer ? qa.answer.toLowerCase() : '';
      return question.includes(this.searchTerm.toLowerCase()) || 
             answer.includes(this.searchTerm.toLowerCase());
    });
    this.filteredQAList = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  // Helper Methods
  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  getUserAvatar(userId: string): string {
    return `https://ui-avatars.com/api/?name=${this.getUserName(userId)}&background=random`;
  }

  getThemeName(themeId: string): string {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.name : '-';
  }


  handleModalClose(event: any): void {
    this.isAddEditModalOpen = false;
    if (event?.refresh) {
      this.fetchQAList();
    }
  }

  handleUploadModalClose(): void {
    this.isUploadModalOpen = false;
    this.fetchQAList();
  }


  onButtonMouseEnter(button: keyof typeof this.buttonStates): void {
    this.buttonStates[button] = 'hovered';
  }

  onButtonMouseLeave(button: keyof typeof this.buttonStates): void {
    this.buttonStates[button] = 'initial';
  }

  onRowMouseEnter(qaId: string): void {
    this.rowStates[qaId] = 'hovered';
  }

  onRowMouseLeave(qaId: string): void {
    this.rowStates[qaId] = 'initial';
  }



  private initializeRowStates(): void {
    this.qaList.forEach(qa => {
      this.rowStates[qa.id] = 'initial';
    });
  }


  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}