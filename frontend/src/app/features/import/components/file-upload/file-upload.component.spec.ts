import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    fixture.componentRef.setInput('maxFileSize', 5 * 1024 * 1024);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders upload area and max file size hint', () => {
    const uploadArea = fixture.debugElement.query(By.css('.upload-area'));
    const hint = fixture.debugElement.query(By.css('.hint'));

    expect(uploadArea).toBeTruthy();
    expect(hint.nativeElement.textContent).toContain('5MB');
  });

  it('emits fileSelected and fileUpload for a valid dropped csv file', () => {
    const file = new File(['name,age'], 'questions.csv', { type: 'text/csv' });
    const fileSelectedSpy = vi.spyOn(component.fileSelected, 'emit');
    const fileUploadSpy = vi.spyOn(component.fileUpload, 'emit');

    component.onDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent);

    expect(fileSelectedSpy).toHaveBeenCalledWith({ file });
    expect(fileUploadSpy).toHaveBeenCalledWith({ file });
    expect(component.errorMessage()).toBe('');
  });

  it('rejects files that exceed the configured size', () => {
    fixture.componentRef.setInput('maxFileSize', 1);
    fixture.detectChanges();
    const file = new File(['long-content'], 'questions.csv', { type: 'text/csv' });
    const fileSelectedSpy = vi.spyOn(component.fileSelected, 'emit');

    component.onDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent);

    expect(component.errorMessage()).toContain('exceeds');
    expect(fileSelectedSpy).not.toHaveBeenCalled();
  });

  it('rejects unsupported file extensions', () => {
    const file = new File(['hello'], 'questions.txt', { type: 'text/plain' });

    component.onDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent);

    expect(component.errorMessage()).toContain('CSV or JSON');
  });
});
