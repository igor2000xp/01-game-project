import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { apiInterceptor } from './api.interceptor';
import { environment } from '../../../environments/environment';

describe('apiInterceptor', () => {
  it('prefixes relative URLs with api base URL', (done) => {
    const req = new HttpRequest('GET', '/questions');

    apiInterceptor(req, (nextReq) => {
      expect(nextReq.url).toBe(`${environment.apiUrl}/questions`);
      return of({} as any);
    }).subscribe(() => done());
  });

  it('does not modify absolute URLs', (done) => {
    const req = new HttpRequest('GET', 'https://example.com/questions');

    apiInterceptor(req, (nextReq) => {
      expect(nextReq.url).toBe('https://example.com/questions');
      return of({} as any);
    }).subscribe(() => done());
  });

  it('maps server errors to message string', (done) => {
    const req = new HttpRequest('GET', '/questions');
    const backendError = new HttpErrorResponse({
      status: 500,
      error: { message: 'Server exploded' },
    });

    apiInterceptor(req, () => throwError(() => backendError)).subscribe({
      next: () => {
        throw new Error('Expected an error');
      },
      error: (message) => {
        expect(message).toBe('Server exploded');
        done();
      },
    });
  });
});
