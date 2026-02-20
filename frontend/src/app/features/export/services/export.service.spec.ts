import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExportService } from './export.service';
import { environment } from '../../../../../environments/environment';

describe('ExportService', () => {
  let service: ExportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should export questions as CSV', () => {
    const request = { format: 'csv' };
    service.exportQuestions(request as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/export`);
    expect(req.request.method).toBe('POST');
    req.flush(new Blob(['csv,data'], { type: 'text/csv' }));
  });

  it('should export questions as JSON', () => {
    const request = { format: 'json' };
    service.exportQuestions(request as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/export`);
    expect(req.request.method).toBe('POST');
    req.flush(new Blob(['json,data'], { type: 'application/json' }));
  });

  it('should generate CSV filename', () => {
    const filename = service.generateFilename('csv');
    expect(filename).toMatch(/questions-export-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv/);
  });

  it('should generate JSON filename', () => {
    const filename = service.generateFilename('json');
    expect(filename).toMatch(/questions-export-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.json/);
  });
});
