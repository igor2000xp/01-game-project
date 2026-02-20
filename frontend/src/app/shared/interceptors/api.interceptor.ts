import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const apiInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Add API URL prefix if not already absolute
  const apiReq = !req.url.startsWith('http')
    ? req.clone({ url: `${environment.apiUrl}${req.url}` })
    : req;

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
      return throwError(() => errorMessage);
    })
  );
};
