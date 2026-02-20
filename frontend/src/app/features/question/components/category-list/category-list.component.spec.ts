import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { CategoryListComponent } from './category-list.component';
import { Category } from '../../models/question.model';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;

  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Geography',
      question_count: 2,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    fixture.componentRef.setInput('categories', categories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders category entries with count', () => {
    expect(fixture.debugElement.query(By.css('[data-cy="category-item"]'))).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('2 questions');
  });

  it('emits create when add category button is clicked', () => {
    const createSpy = vi.spyOn(component.create, 'emit');
    (
      fixture.debugElement.query(By.css('[data-cy="add-category-button"]'))
        .nativeElement as HTMLButtonElement
    ).click();

    expect(createSpy).toHaveBeenCalled();
  });
});
