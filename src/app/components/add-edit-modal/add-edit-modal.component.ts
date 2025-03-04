import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('modalState', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ]),
    trigger('contentState', [
      state('void', style({
        transform: 'scale(0.7)',
        opacity: 0
      })),
      state('*', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      transition('void => *', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('* => void', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('formState', [
      state('void', style({
        transform: 'translateY(20px)',
        opacity: 0
      })),
      state('in', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => in', animate('400ms 200ms ease-out'))
    ])
  ]
})
export class AddEditModalComponent {
  @Input() selectedQA: any;
  @Output() close = new EventEmitter<any>();

  qaForm: FormGroup;
  themes$: Observable<any[]>;
  subThemes$: Observable<any[]>;
  formFocus: string = '';
  modalState: string = '';

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.qaForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      theme: ['', Validators.required],
      subTheme: ['', Validators.required],
    });
    this.themes$ = this.questionService.getThemes();
    this.subThemes$ = this.questionService.getSubThemes();
  }

  ngOnInit(): void {
    if (this.selectedQA) {
      this.qaForm.patchValue(this.selectedQA);
    }
    this.themes$.subscribe();
    this.subThemes$.subscribe();

    // Initialize animations
    setTimeout(() => {
      this.modalState = 'in';
    });
  }

  save(): void {
    if (this.qaForm.valid) {
      const data = this.qaForm.value;
      if (this.selectedQA) {
        this.questionService.updateQuestion(this.selectedQA.id, data).subscribe(() => {
          this.closeModal();
        });
      } else {
        this.questionService.addQuestion(data).subscribe(() => {
          this.closeModal();
        });
      }
    }
  }

  closeModal(): void {
    this.modalState = 'void';
    setTimeout(() => {
      this.close.emit({ refresh: true });
    }, 200);
  }
}
