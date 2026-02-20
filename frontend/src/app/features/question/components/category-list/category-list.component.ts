import { Component, input, output, Output, EventEmitter } from '@angular/core';
import { Category } from '../../models/question.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  categories = input.required<Category[]>();

  create = output<void>();
  edit = output<Category>();
  delete = output<string>();
}

@Component({
  selector: 'app-category-list-item',
  standalone: true,
  templateUrl: './category-list-item.component.html',
  styleUrl: './category-list-item.component.css',
})
export class CategoryListItemComponent {
  category = input.required<Category>();
  showDeleteConfirm = false;

  edit = new EventEmitter<Category>();
  delete = new EventEmitter<string>();

  confirmDelete(): void {
    this.delete.emit(this.category().id);
    this.showDeleteConfirm = false;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
