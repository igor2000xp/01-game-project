import { Component, input, output, signal, computed, effect } from '@angular/core';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../models/question.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent {
  category = input<Category | undefined>();

  submit = output<CreateCategoryDto | UpdateCategoryDto>();
  cancel = output<void>();

  readonly isEditMode = computed(() => !!this.category());

  readonly formData = signal({
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
    this.formData.update((f) => ({ ...f, name: input.value }));
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
