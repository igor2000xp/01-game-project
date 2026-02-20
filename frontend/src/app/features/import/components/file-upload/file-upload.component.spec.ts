import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FileUploadComponent, FileUploadEvent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let fileSelectedSpy: jasmine.Spy<FileUploadEvent>;
  let fileUploadSpy: jasmine.Spy<FileUploadEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;

    // Create spy outputs
    component.fileSelected = jasmine.createSpyObj('fileSelected', ['emit']) as any;
    component.fileUpload = jasmine.createSpyObj('fileUpload', ['emit']) as any;
    fileSelectedSpy = component.fileSelected.emit as jasmine.Spy;
    fileUploadSpy = component.fileUpload.emit as jasmine.Spy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display upload area', () => {
    const uploadArea = fixture.debugElement.query(By.css('.upload-area'));
    expect(uploadArea).toBeTruthy();
  });

  it('should show max file size', () => {
    component.maxFileSize = 10 * 1024 * 1024; // 10MB
    fixture.detectChanges();
    const hint = fixture.debugElement.query(By.css('.hint'));
    expect(hint.nativeElement.textContent).toContain('10MB');
  });

  it('should emit fileSelected when file is dropped', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    const event = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
    });
    (event.dataTransfer as any).files = [file];

    component.onDrop(event);
    fixture.detectChanges();

    expect(fileSelectedSpy).toHaveBeenCalledWith({ file });
    expect(fileUploadSpy).toHaveBeenCalledWith({ file });
  });

  it('should reject file exceeding size limit', () => {
    component.maxFileSize.set(100); // 100 bytes
    const file = new File(['content'], 'large.txt', { type: 'text/plain' });
    const event = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
    });
    (event.dataTransfer as any).files = [file];

    component.onDrop(event);
    fixture.detectChanges();

    expect(component.errorMessage()).toContain('exceeds');
    expect(fileSelectedSpy).not.toHaveBeenCalled();
  });

  it('should reject invalid file type', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const event = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
    });
    (event.dataTransfer as any).files = [file];

    component.onDrop(event);
    fixture.detectChanges();

    expect(component.errorMessage()).toContain('CSV or JSON');
    expect(fileSelectedSpy).not.toHaveBeenCalled();
  });

  it('should clear error message', () => {
    component.errorMessage.set('Some error');
    component.clearError();
    expect(component.errorMessage()).toBe('');
  });
});
