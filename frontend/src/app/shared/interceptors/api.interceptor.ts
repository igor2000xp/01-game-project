import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

const getErrorMessage = (error: HttpErrorResponse): string => {
  const payload: unknown = error.error;

  if (payload instanceof ErrorEvent) {
    return payload.message;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return `Error Code: ${error.status}`;
};

export const apiInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Add API URL prefix if not already absolute
  const apiReq = !req.url.startsWith('http')
    ? req.clone({ url: `${environment.apiUrl}${req.url}` })
    : req;

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => throwError(() => getErrorMessage(error)))
  );
};
