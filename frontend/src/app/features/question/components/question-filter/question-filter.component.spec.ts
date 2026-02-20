import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { QuestionFilterComponent } from './question-filter.component';
import { Category } from '../../models/question.model';

describe('QuestionFilterComponent', () => {
  let component: QuestionFilterComponent;
  let fixture: ComponentFixture<QuestionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders search and category filter controls', () => {
    expect(fixture.debugElement.query(By.css('[data-cy="search-input"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('[data-cy="category-filter"]'))).toBeTruthy();
  });

  it('emits searchChange when typing in search input', () => {
    const searchSpy = vi.spyOn(component.searchChange, 'emit');
    const input = fixture.debugElement.query(By.css('#search-input'))
      .nativeElement as HTMLInputElement;

    input.value = 'fra';
    input.dispatchEvent(new Event('input'));

    expect(searchSpy).toHaveBeenCalledWith('fra');
  });

  it('emits categoryChange when category selection changes', () => {
    const categorySpy = vi.spyOn(component.categoryChange, 'emit');
    fixture.componentRef.setInput('categories', [
      { id: 'cat-1', name: 'Geography', question_count: 3 },
    ]);
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#category-select'))
      .nativeElement as HTMLSelectElement;

    select.value = 'cat-1';
    select.dispatchEvent(new Event('change'));

    expect(categorySpy).toHaveBeenCalledWith('cat-1');
  });

  it('shows clear filters button only when filters are active', () => {
    fixture.componentRef.setInput('searchQuery', '');
    fixture.componentRef.setInput('selectedCategory', '');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.clear-btn'))).toBeNull();

    fixture.componentRef.setInput('searchQuery', 'math');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.clear-btn'))).toBeTruthy();
  });

  it('emits clearFilters when clear button is clicked', () => {
    const clearSpy = vi.spyOn(component.clearFilters, 'emit');
    fixture.componentRef.setInput('searchQuery', 'math');
    fixture.detectChanges();

    (fixture.debugElement.query(By.css('.clear-btn')).nativeElement as HTMLButtonElement).click();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('renders category options from input categories', () => {
    const categories: Category[] = [
      { id: '1', name: 'Geography', question_count: 2 },
      { id: '2', name: 'History', question_count: 1 },
    ];

    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options).toHaveLength(3);
    expect((options[1]?.nativeElement as HTMLElement).textContent).toContain('Geography');
  });
});
