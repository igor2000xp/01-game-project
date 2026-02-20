import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Question,
  Category,
  QuestionFilter,
  QuestionListResponse,
  CreateQuestionDto,
  UpdateQuestionDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  // Question CRUD operations

  getQuestions(filter: QuestionFilter = {}): Observable<QuestionListResponse> {
    return this.http.get<QuestionListResponse>('/questions', {
      params: filter as any,
    });
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`/questions/${id}`);
  }

  createQuestion(dto: CreateQuestionDto): Observable<Question> {
    return this.http.post<Question>('/questions', dto);
  }

  updateQuestion(id: string, dto: UpdateQuestionDto): Observable<Question> {
    return this.http.put<Question>(`/questions/${id}`, dto);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`/questions/${id}`);
  }

  bulkDeleteByCategory(categoryId: string): Observable<void> {
    return this.http.post<void>('/questions/bulk-delete', {
      category_id: categoryId,
    });
  }

  // Category CRUD operations

  getCategories(includeCounts = false): Observable<Category[]> {
    if (includeCounts) {
      return this.http.get<{ data: Category[] }>('/categories/with-counts').pipe(
        map((response) => response.data)
      );
    }
    return this.http.get<Category[]>('/categories');
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`/categories/${id}`);
  }

  createCategory(dto: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>('/categories', dto);
  }

  updateCategory(id: string, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.put<Category>(`/categories/${id}`, dto);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`/categories/${id}`);
  }
}
