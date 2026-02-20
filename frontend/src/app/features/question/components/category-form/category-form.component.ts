import { Component, signal, computed, effect, EventEmitter, Input, Output } from '@angular/core';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../models/question.model';

interface CategoryFormData {
  name: string;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent {
  private readonly _category = signal<Category | undefined>(undefined);

  @Input('category')
  set categoryInput(value: Category | undefined) {
    this._category.set(value);
  }

  category(): Category | undefined {
    return this._category();
  }

  @Output() submit = new EventEmitter<CreateCategoryDto | UpdateCategoryDto>();
  @Output() cancel = new EventEmitter<void>();

  readonly isEditMode = computed(() => !!this.category());

  readonly formData = signal<CategoryFormData>({
    name: '',
  });

  constructor() {
    effect(() => {
      const c = this.category();
      if (c) {
        this.formData.set({ name: c.name });
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.formData.set({ name: '' });
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formData.update((form: CategoryFormData) => ({ ...form, name: input.value }));
  }

  onSubmit(): void {
    const data = this.formData();

    // Validate required fields
    if (!data.name.trim()) {
      return;
    }

    const dto = this.isEditMode()
      ? ({ name: data.name } as UpdateCategoryDto)
      : ({ name: data.name } as CreateCategoryDto);

    this.submit.emit(dto);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isFormValid(): boolean {
    return this.formData().name.trim().length > 0;
  }
}
