import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ImportService } from './import.service';
import { environment } from '../../../../../environments/environment';

describe('ImportService', () => {
  let service: ImportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ImportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload file', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    service.uploadFile(file).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/import`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({ session_id: 'session-123' });
  });

  it('should get import status', () => {
    service.getImportStatus('session-123').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/import/session-123/status`);
    expect(req.request.method).toBe('GET');
    req.flush({
      sessionId: 'session-123',
      status: 'processing',
      total: 10,
      processed: 5,
      success: 4,
      failed: 1,
      errors: [],
    });
  });
});
