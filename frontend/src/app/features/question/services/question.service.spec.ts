import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { QuestionService } from './question.service';
import { environment } from '../../../../../environments/environment';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get questions', () => {
    service.getQuestions({ page: 1, limit: 10 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], total: 0, page: 1, limit: 10 });
  });

  it('should get single question', () => {
    service.getQuestion('123').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/123`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: '123', text: 'Test' });
  });

  it('should create question', () => {
    const dto = { text: 'Question', answer: 'Answer' };
    service.createQuestion(dto as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: '123', ...dto });
  });

  it('should update question', () => {
    const dto = { text: 'Updated' };
    service.updateQuestion('123', dto as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/123`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: '123', ...dto });
  });

  it('should delete question', () => {
    service.deleteQuestion('123').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/questions/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get categories', () => {
    service.getCategories().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get categories with counts', () => {
    service.getCategories(true).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/categories/with-counts`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });
});
