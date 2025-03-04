import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { ThemeService } from '../../services/theme.service';
import { SubthemeService } from '../../services/subtheme.service';
import { CategoryService } from '../../services/category.service'; // Import CategoryService
import { QuestionService } from '../../services/question.service';
import{ NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],  
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  themes: any[] = [];
  subThemes: any[] = [];
  categories: any[] = [];
  selectedTheme: number | null = null; 
  selectedSubTheme: number | null = null;
  selectedCategory: number | null = null;
  listquestions: any[] = [];
  filteredQuestions: any[] = [];

  @Output() filterChange = new EventEmitter<any>();

  constructor(
    private questionService: QuestionService,
    private themeService: ThemeService,
    private subThemeService: SubthemeService,
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.loadThemes();
    this.fetchQuestions();
  }

  loadThemes() {
    this.themeService.getThemes().subscribe((data) => {
      this.themes = data;
    });
  }

  fetchQuestions() {
    this.questionService.getQuestions().subscribe((data) => {
      this.listquestions = data;
      this.filteredQuestions = data; 
      console.log(this.filteredQuestions);
    });
  }

  onThemeChange(themeId: number) {
    this.selectedSubTheme = null; 
    this.selectedCategory = null; 
    this.subThemes = []; 
    this.categories = []; 

    if (themeId) {
      this.subThemeService.getSubThemesByThemeId(themeId).subscribe((data) => {
        this.subThemes = data;
      });
    }
  }

  onSubThemeChange(subThemeId: number) {
    this.selectedCategory = null;
    this.categories = []; 

    if (subThemeId) {
      this.categoryService.getCategoriesBySubThemeId(subThemeId).subscribe((data) => {
        this.categories = data;
      });
    }
  }

  applyFilter() {
    this.filteredQuestions = this.listquestions.filter((question) => {
      const themeName = this.themes.find(t => t.id === this.selectedTheme)?.name || '';
      const subThemeName = this.subThemes.find(st => st.id === this.selectedSubTheme)?.name || '';
      const categoryName = this.categories.find(c => c.id === this.selectedCategory)?.name || '';

      const matchesTheme = this.selectedTheme ? ("" + question.theme).toLowerCase() === themeName.toLowerCase() : true;
      const matchesSubTheme = this.selectedSubTheme ? ("" + question.subTheme).toLowerCase() === subThemeName.toLowerCase() : true;
      const matchesCategory = this.selectedCategory ? ("" + question.category).toLowerCase() === categoryName.toLowerCase() : true;

      return matchesTheme && matchesSubTheme && matchesCategory;
    });

    this.filterChange.emit({
      theme: this.selectedTheme,
      subTheme: this.selectedSubTheme,
      category: this.selectedCategory,
    });
  }
}