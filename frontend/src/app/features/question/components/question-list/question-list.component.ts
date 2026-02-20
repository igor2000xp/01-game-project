import { Component, OnInit, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { Question, Category } from '../../models/question.model';

@Component({
  selector: 'app-question-list',
  standalone: true,
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent implements OnInit {
  private readonly _questions = signal<Question[]>([]);
  private readonly _total = signal(0);
  private readonly _categories = signal<Category[]>([]);

  private readonly _currentPage = signal(1);
  private readonly _pageSize = signal(20);

  @Input('questions')
  set questionsInput(value: Question[]) {
    this._questions.set(value);
  }

  questions(): Question[] {
    return this._questions();
  }

  @Input('total')
  set totalInput(value: number) {
    this._total.set(value);
  }

  total(): number {
    return this._total();
  }

  @Input('categories')
  set categoriesInput(value: Category[] | undefined) {
    this._categories.set(value ?? []);
  }

  categories(): Category[] {
    return this._categories();
  }

  @Input('currentPage')
  set currentPageInput(value: number | undefined) {
    this._currentPage.set(value ?? 1);
  }

  currentPage(): number {
    return this._currentPage();
  }

  @Input('pageSize')
  set pageSizeInput(value: number | undefined) {
    this._pageSize.set(value ?? 20);
  }

  pageSize(): number {
    return this._pageSize();
  }

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  readonly questionTypes: Record<Question['type'], string> = {
    'multiple-choice': 'MC',
    'open-ended': 'Open',
    'true-false': 'TF',
  };

  readonly difficultyColors: Record<NonNullable<Question['difficulty']>, string> = {
    easy: '#28a745',
    medium: '#ffc107',
    hard: '#dc3545',
  };

  readonly totalPages = computed(() => {
    return Math.ceil(this.total() / this.pageSize());
  });

  readonly displayedPages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > 3) {
        pages.push('...');
      }
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) {
        pages.push('...');
      }
      pages.push(total);
    }

    return pages;
  });

  ngOnInit(): void {}

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '-';
    const category = this.categories().find((category: Category) => category.id === categoryId);
    return category?.name || '-';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getQuestionTypeLabel(type: Question['type']): string {
    return this.questionTypes[type];
  }

  getDifficultyColor(difficulty?: Question['difficulty']): string {
    const key = difficulty ?? 'medium';
    return this.difficultyColors[key];
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }
}
