import { Component, OnInit, input, output, computed } from '@angular/core';
import { Question, Category } from '../../models/question.model';

@Component({
  selector: 'app-question-list',
  standalone: true,
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent implements OnInit {
  questions = input.required<Question[]>();
  total = input.required<number>();
  categories = input<Category[]>([]);

  currentPage = input<number>(1);
  pageSize = input<number>(20);

  edit = output<string>();
  delete = output<string>();
  pageChange = output<number>();

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
