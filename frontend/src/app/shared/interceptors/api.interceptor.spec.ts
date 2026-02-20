import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { apiInterceptor } from './api.interceptor';
import { environment } from '../../../environments/environment';

describe('apiInterceptor', () => {
  it('prefixes relative URLs with api base URL', async () => {
    const req = new HttpRequest('GET', '/questions');

    await firstValueFrom(
      apiInterceptor(req, (nextReq) => {
        expect(nextReq.url).toBe(`${environment.apiUrl}/questions`);
        return of(new HttpResponse({ status: 200 }));
      })
    );
  });

  it('does not modify absolute URLs', async () => {
    const req = new HttpRequest('GET', 'https://example.com/questions');

    await firstValueFrom(
      apiInterceptor(req, (nextReq) => {
        expect(nextReq.url).toBe('https://example.com/questions');
        return of(new HttpResponse({ status: 200 }));
      })
    );
  });

  it('maps server errors to backend message', async () => {
    const req = new HttpRequest('GET', '/questions');
    const backendError = new HttpErrorResponse({
      status: 500,
      error: { message: 'Server exploded' },
    });

    try {
      await firstValueFrom(apiInterceptor(req, () => throwError(() => backendError)));
      throw new Error('Expected request to fail');
    } catch (err) {
      expect(err).toBe('Server exploded');
    }
  });
});
