import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { QuestionService } from './question.service';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets paginated questions', async () => {
    const responsePromise = firstValueFrom(service.getQuestions({ page: 1, limit: 10 }));

    const req = httpMock.expectOne('/questions?page=1&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], total: 0, page: 1, limit: 10 });

    await expect(responsePromise).resolves.toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  });

  it('gets single question by id', async () => {
    const responsePromise = firstValueFrom(service.getQuestion('123'));

    const req = httpMock.expectOne('/questions/123');
    expect(req.request.method).toBe('GET');
    req.flush({ id: '123', text: 'Test', answer: 'A', type: 'open-ended' });

    await expect(responsePromise).resolves.toEqual({
      id: '123',
      text: 'Test',
      answer: 'A',
      type: 'open-ended',
    });
  });

  it('creates and updates questions', () => {
    service.createQuestion({ text: 'Q', answer: 'A', type: 'open-ended' }).subscribe();
    let req = httpMock.expectOne('/questions');
    expect(req.request.method).toBe('POST');
    req.flush({ id: '1' });

    service.updateQuestion('1', { text: 'Updated' }).subscribe();
    req = httpMock.expectOne('/questions/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: '1', text: 'Updated' });
  });

  it('deletes question and category', () => {
    service.deleteQuestion('1').subscribe();
    let req = httpMock.expectOne('/questions/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    service.deleteCategory('cat-1').subscribe();
    req = httpMock.expectOne('/categories/cat-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('gets category list and category counts', async () => {
    const categoriesPromise = firstValueFrom(service.getCategories());
    let req = httpMock.expectOne('/categories');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'cat-1', name: 'Math', created_at: '2024-01-01', updated_at: '2024-01-01' }]);

    const categoriesWithCountsPromise = firstValueFrom(service.getCategories(true));
    req = httpMock.expectOne('/categories/with-counts');
    expect(req.request.method).toBe('GET');
    req.flush({
      data: [
        {
          id: 'cat-1',
          name: 'Math',
          question_count: 3,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ],
    });

    await expect(categoriesPromise).resolves.toEqual([
      { id: 'cat-1', name: 'Math', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ]);
    await expect(categoriesWithCountsPromise).resolves.toEqual([
      {
        id: 'cat-1',
        name: 'Math',
        question_count: 3,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ]);
  });
});
