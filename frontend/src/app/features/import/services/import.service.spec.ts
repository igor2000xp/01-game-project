import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ImportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('uploads files as form data', () => {
    const file = new File(['content'], 'questions.csv', { type: 'text/csv' });
    service.uploadFile(file).subscribe();

    const req = httpMock.expectOne('/questions/import');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({ session_id: 'session-123' });
  });

  it('gets import status by session id', () => {
    service.getImportStatus('session-123').subscribe();

    const req = httpMock.expectOne('/questions/import/session-123/status');
    expect(req.request.method).toBe('GET');
    req.flush({
      sessionId: 'session-123',
      status: 'processing',
      total: 2,
      processed: 1,
      success: 1,
      failed: 0,
      errors: [],
    });
  });
});
