import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { Category } from '../../models/question.model';

@Component({
  selector: 'app-question-filter',
  standalone: true,
  templateUrl: './question-filter.component.html',
  styleUrl: './question-filter.component.css',
})
export class QuestionFilterComponent {
  private readonly _categories = signal<Category[]>([]);
  private readonly _searchQuery = signal('');
  private readonly _selectedCategory = signal('');
  private readonly _showFilter = signal(true);

  @Input('categories')
  set categoriesInput(value: Category[] | undefined) {
    this._categories.set(value ?? []);
  }

  categories(): Category[] {
    return this._categories();
  }

  @Input('searchQuery')
  set searchQueryInput(value: string | undefined) {
    this._searchQuery.set(value ?? '');
  }

  searchQuery(): string {
    return this._searchQuery();
  }

  @Input('selectedCategory')
  set selectedCategoryInput(value: string | undefined) {
    this._selectedCategory.set(value ?? '');
  }

  selectedCategory(): string {
    return this._selectedCategory();
  }

  @Input('showFilter')
  set showFilterInput(value: boolean | undefined) {
    this._showFilter.set(value ?? true);
  }

  showFilter(): boolean {
    return this._showFilter();
  }

  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  readonly hasActiveFilters = computed(() => {
    return this.searchQuery().length > 0 || this.selectedCategory().length > 0;
  });

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onCategorySelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(value);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
