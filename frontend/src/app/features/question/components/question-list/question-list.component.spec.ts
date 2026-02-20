import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { QuestionListComponent } from './question-list.component';
import { Category, Question } from '../../models/question.model';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  const questions: Question[] = [
    {
      id: 'q1',
      text: 'What is 2+2?',
      answer: '4',
      category_id: 'cat-1',
      type: 'open-ended',
      is_deleted: false,
      difficulty: 'easy',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
  ];

  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Math',
      question_count: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionListComponent);
    fixture.componentRef.setInput('questions', questions);
    fixture.componentRef.setInput('total', 25);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('pageSize', 20);
    fixture.componentRef.setInput('categories', categories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders question rows and resolves category names', () => {
    expect(fixture.debugElement.query(By.css('[data-cy="question-item"]'))).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Math');
  });

  it('emits delete event when delete button is clicked', () => {
    const deleteSpy = vi.spyOn(component.delete, 'emit');
    (
      fixture.debugElement.query(By.css('[data-cy="delete-button"]'))
        .nativeElement as HTMLButtonElement
    ).click();

    expect(deleteSpy).toHaveBeenCalledWith('q1');
  });

  it('emits page change when next page button is clicked', () => {
    const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
    const nextButton = fixture.debugElement.queryAll(By.css('.page-btn')).at(-1);
    (nextButton?.nativeElement as HTMLButtonElement).click();

    expect(pageChangeSpy).toHaveBeenCalledWith(2);
  });
});
