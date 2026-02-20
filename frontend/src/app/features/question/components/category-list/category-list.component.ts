import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Category } from '../../models/question.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  private readonly _categories = signal<Category[]>([]);

  @Input('categories')
  set categoriesInput(value: Category[]) {
    this._categories.set(value);
  }

  categories(): Category[] {
    return this._categories();
  }

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Category>();
  @Output() delete = new EventEmitter<string>();
}

@Component({
  selector: 'app-category-list-item',
  standalone: true,
  templateUrl: './category-list-item.component.html',
  styleUrl: './category-list-item.component.css',
})
export class CategoryListItemComponent {
  private readonly _category = signal<Category | null>(null);
  showDeleteConfirm = false;

  @Input('category')
  set categoryInput(value: Category) {
    this._category.set(value);
  }

  category(): Category {
    const category = this._category();
    if (!category) {
      throw new Error('Category is required');
    }
    return category;
  }

  @Output() edit = new EventEmitter<Category>();

  @Output() delete = new EventEmitter<string>();

  confirmDelete(): void {
    this.delete.emit(this.category().id);
    this.showDeleteConfirm = false;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
