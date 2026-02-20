import { Component, Output, EventEmitter, signal, Input } from '@angular/core';

export type FileUploadEvent = {
  file: File;
};

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<FileUploadEvent>();
  @Output() fileUpload = new EventEmitter<FileUploadEvent>();

  private readonly _maxFileSize = signal(0);

  @Input('maxFileSize')
  set maxFileSizeInput(value: number) {
    this._maxFileSize.set(value);
  }

  maxFileSize(): number {
    return this._maxFileSize();
  }

  isDragging = signal(false);
  errorMessage = signal('');

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage.set('');

    // Validate file size
    if (file.size > this.maxFileSize()) {
      this.errorMessage.set(`File size exceeds ${this.maxFileSize() / 1024 / 1024}MB limit`);
      return;
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isCsv = fileName.endsWith('.csv');
    const isJson = fileName.endsWith('.json');

    if (!isCsv && !isJson) {
      this.errorMessage.set('Please upload a CSV or JSON file');
      return;
    }

    this.fileSelected.emit({ file });
    this.fileUpload.emit({ file });
  }

  clearError(): void {
    this.errorMessage.set('');
  }

  get maxFileSizeMB(): number {
    return this.maxFileSize() / 1024 / 1024;
  }
}
