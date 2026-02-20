import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QuestionFilterComponent } from './question-filter.component';
import { Category } from '../../models/question.model';

describe('QuestionFilterComponent', () => {
  let component: QuestionFilterComponent;
  let fixture: ComponentFixture<QuestionFilterComponent>;
  let searchChangeSpy: jasmine.Spy<string>;
  let categoryChangeSpy: jasmine.Spy<string>;
  let clearFiltersSpy: jasmine.Spy<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionFilterComponent);
    component = fixture.componentInstance;

    // Create spy outputs
    component.searchChange = jasmine.createSpyObj('searchChange', ['emit']) as any;
    component.categoryChange = jasmine.createSpyObj('categoryChange', ['emit']) as any;
    component.clearFilters = jasmine.createSpyObj('clearFilters', ['emit']) as any;
    searchChangeSpy = component.searchChange.emit as jasmine.Spy;
    categoryChangeSpy = component.categoryChange.emit as jasmine.Spy;
    clearFiltersSpy = component.clearFilters.emit as jasmine.Spy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show search input', () => {
    const searchInput = fixture.debugElement.query(By.css('#search-input'));
    expect(searchInput).toBeTruthy();
  });

  it('should show category select', () => {
    const categorySelect = fixture.debugElement.query(By.css('#category-select'));
    expect(categorySelect).toBeTruthy();
  });

  it('should emit searchChange on input', () => {
    const searchInput = fixture.debugElement.query(By.css('#search-input'));
    searchInput.nativeElement.value = 'test query';
    searchInput.nativeElement.dispatchEvent(new Event('input'));

    expect(searchChangeSpy).toHaveBeenCalledWith('test query');
  });

  it('should emit categoryChange on select', () => {
    const categorySelect = fixture.debugElement.query(By.css('#category-select'));
    categorySelect.nativeElement.value = 'cat-1';
    categorySelect.nativeElement.dispatchEvent(new Event('change'));

    expect(categoryChangeSpy).toHaveBeenCalledWith('cat-1');
  });

  it('should emit clearFilters on button click', () => {
    component.searchQuery.set('test');
    component.selectedCategory.set('cat-1');
    fixture.detectChanges();

    const clearBtn = fixture.debugElement.query(By.css('.clear-btn'));
    clearBtn.nativeElement.click();
    fixture.detectChanges();

    expect(clearFiltersSpy).toHaveBeenCalled();
  });

  it('should display category options', () => {
    const categories: Category[] = [
      { id: '1', name: 'Category 1', question_count: 10 },
      { id: '2', name: 'Category 2', question_count: 5 },
    ];
    component.categories.set(categories);
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(3); // 2 categories + "All Categories"
  });

  it('should compute hasActiveFilters correctly', () => {
    component.searchQuery.set('');
    component.selectedCategory.set('');
    expect(component.hasActiveFilters()).toBe(false);

    component.searchQuery.set('test');
    expect(component.hasActiveFilters()).toBe(true);

    component.searchQuery.set('');
    component.selectedCategory.set('cat-1');
    expect(component.hasActiveFilters()).toBe(true);
  });
});
