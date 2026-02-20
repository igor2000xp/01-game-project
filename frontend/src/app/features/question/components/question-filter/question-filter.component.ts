import { Component, input, output, computed } from '@angular/core';
import { Category } from '../../models/question.model';

@Component({
  selector: 'app-question-filter',
  standalone: true,
  templateUrl: './question-filter.component.html',
  styleUrl: './question-filter.component.css',
})
export class QuestionFilterComponent {
  categories = input<Category[]>([]);
  searchQuery = input<string>('');
  selectedCategory = input<string>('');
  showFilter = input<boolean>(true);

  searchChange = output<string>();
  categoryChange = output<string>();
  clearFilters = output<void>();

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
