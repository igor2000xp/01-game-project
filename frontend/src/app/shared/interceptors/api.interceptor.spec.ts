import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { apiInterceptor } from './api.interceptor';
import { environment } from '../../../environments/environment';

describe('apiInterceptor', () => {
  it('prefixes relative URLs with api base URL', () => {
    const req = new HttpRequest('GET', '/questions');

    return apiInterceptor(req, (nextReq) => {
      expect(nextReq.url).toBe(`${environment.apiUrl}/questions`);
      return of(new HttpResponse({ status: 200 }));
    });
  });

  it('does not modify absolute URLs', () => {
    const req = new HttpRequest('GET', 'https://example.com/questions');

    return apiInterceptor(req, (nextReq) => {
      expect(nextReq.url).toBe('https://example.com/questions');
      return of(new HttpResponse({ status: 200 }));
    });
  });

  it('maps server errors to message string', () => {
    const req = new HttpRequest('GET', '/questions');
    const backendError = new HttpErrorResponse({
      status: 500,
      error: { message: 'Server exploded' },
    });

    return new Promise<void>((resolve, reject) => {
      apiInterceptor(req, () => throwError(() => backendError)).subscribe({
        next: () => {
          reject(new Error('Expected an error'));
        },
        error: (err: unknown) => {
          expect(String(err)).toContain('500');
          resolve();
        },
      });
    });
  });
});
