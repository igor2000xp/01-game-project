import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportSession, ImportProgress } from '../models/import.model';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ session_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ session_id: string }>('/questions/import', formData);
  }

  getImportStatus(sessionId: string): Observable<ImportProgress> {
    return this.http.get<ImportProgress>(`/questions/import/${sessionId}/status`);
  }

  getImportSession(sessionId: string): Observable<ImportSession> {
    return this.http.get<ImportSession>(`/questions/import/${sessionId}`);
  }
}
