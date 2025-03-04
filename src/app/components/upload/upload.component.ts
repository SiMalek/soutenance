import { Component, EventEmitter, Output } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class UploadModalComponent {
  @Output() close = new EventEmitter<void>();
  file: File | null = null;
  excelData: any[] = [];

  constructor(private questionService: QuestionService) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('Excel data:', this.excelData);
    };
    reader.readAsBinaryString(file);
  }

  uploadFile(): void {
    if (this.excelData.length > 0) {
      this.questionService.uploadExcel(this.excelData).subscribe(() => {
        alert('File uploaded successfully!');
        this.close.emit();
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
